const mongoose = require('mongoose');
const FOOD = require('../models/foodModel');

const getAnalytics = async (req, res) => {
    try {
        // Get user ID from authenticated request
        const donorId = req.user._id;
        const donorObjectId = new mongoose.Types.ObjectId(donorId);

        // Get total stats for this user
        const totalDonations = await FOOD.countDocuments({ donorId: donorObjectId });
        const totalServings = await FOOD.aggregate([
            { $match: { donorId: donorObjectId } },
            { $group: { _id: null, total: { $sum: "$totalCount" } } }
        ]);

        // Get distribution data based on time period
        const { period = 'daily' } = req.query;
        
        let timeGrouping;
        let matchCriteria = {
            donorId: donorObjectId // Add donor filter
        };
        
        const now = new Date();
        
        switch(period) {
            case 'daily':
                matchCriteria.date = { 
                    $gte: new Date(now.setDate(now.getDate() - 7)) 
                };
                timeGrouping = {
                    $dateToString: { format: "%Y-%m-%d", date: "$date" }
                };
                break;
                
            case 'monthly':
                matchCriteria.date = { 
                    $gte: new Date(now.setMonth(now.getMonth() - 6)) 
                };
                timeGrouping = {
                    $dateToString: { format: "%Y-%m", date: "$date" }
                };
                break;
                
            case 'yearly':
                matchCriteria.date = { 
                    $gte: new Date(now.setFullYear(now.getFullYear() - 4)) 
                };
                timeGrouping = {
                    $dateToString: { format: "%Y", date: "$date" }
                };
                break;
        }

        const distributionData = await FOOD.aggregate([
            { $match: matchCriteria },
            {
                $group: {
                    _id: timeGrouping,
                    received: { $sum: "$totalCount" },
                    distributed: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "Completed"] },
                                "$totalCount",
                                0
                            ]
                        }
                    }
                }
            },
            { $sort: { "_id": 1 } },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    received: 1,
                    distributed: 1
                }
            }
        ]) || [];

        // Calculate impact metrics
        const impactMetrics = {
            plasticAvoided: totalServings[0]?.total || 0,
            energySaved: Math.round((totalServings[0]?.total || 0) * 0.093), // kWh per serving
            waterSaved: Math.round((totalServings[0]?.total || 0) * 0.142) // gallons per serving
        };

        res.json({
            success: true,
            data: {
                totalDonations: totalDonations || 0,
                impactMetrics,
                distributionData
            }
        });
    } catch (error) {
        // console.error('Analytics Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics data',
            error: error.message
        });
    }
};

module.exports = {
    getAnalytics
}; 