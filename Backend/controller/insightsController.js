const mongoose = require("mongoose");
const FOOD = require("../models/foodModel");
const DONOR = require("../middleware/donorModel");
const RECEIVER = require("../models/receiverModel");

function clampPeriod(period) {
  if (period === "daily" || period === "monthly" || period === "yearly") return period;
  return "daily";
}

function dateFieldExpr() {
  // food model has `date`; mongoose adds `createdAt` timestamps only if enabled (not enabled here)
  return { $ifNull: ["$date", "$createdAt"] };
}

function periodConfig(period) {
  const now = new Date();
  if (period === "monthly") {
    const from = new Date(now);
    from.setMonth(from.getMonth() - 6);
    return { from, format: "%Y-%m" };
  }
  if (period === "yearly") {
    const from = new Date(now);
    from.setFullYear(from.getFullYear() - 4);
    return { from, format: "%Y" };
  }
  // daily: last 7 days
  const from = new Date(now);
  from.setDate(from.getDate() - 7);
  return { from, format: "%Y-%m-%d" };
}

function normalizeCityExpr() {
  // Prefer explicit `city` field if present in documents; else approximate from `address`
  // City key is lowercased & trimmed for grouping consistency.
  return {
    $toLower: {
      $trim: {
        input: {
          $ifNull: [
            "$city",
            {
              $let: {
                vars: { parts: { $split: [{ $ifNull: ["$address", ""] }, ","] } },
                in: {
                  $trim: {
                    input: {
                      $arrayElemAt: [
                        "$$parts",
                        { $subtract: [{ $size: "$$parts" }, 1] },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
  };
}

function normalizeTypeExpr() {
  // Prefer explicit `type` (veg/non-veg) if present; else infer from existing `foodType`.
  // Result is exactly "veg" or "non-veg".
  const raw = {
    $toLower: {
      $trim: {
        input: { $ifNull: ["$type", "$foodType"] },
      },
    },
  };
  return {
    $cond: [{ $regexMatch: { input: raw, regex: "non" } }, "non-veg", "veg"],
  };
}

function amountExpr() {
  // Project reference says `amount`; existing model has `totalCount`.
  return { $ifNull: ["$amount", "$totalCount"] };
}

async function getUserInsights(req, res) {
  try {
    const period = clampPeriod(req.query.period);
    const { from, format } = periodConfig(period);

    // city detection: query param > donor.profile.location
    const donor = await DONOR.findById(req.user._id).select("location pincode");
    const requestedCity = (req.query.city || "").trim();
    const city = requestedCity || (donor?.location || "").trim();
    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required (pass ?city=... or set donor location).",
      });
    }

    const cityKey = city.toLowerCase().trim();

    const baseMatch = {
      donorId: new mongoose.Types.ObjectId(req.user._id),
    };

    // City filter is based on normalizedCityExpr; use $expr for match
    const matchStage = {
      $match: {
        ...baseMatch,
        $expr: { $eq: [normalizeCityExpr(), cityKey] },
      },
    };

    const commonAddFields = {
      $addFields: {
        _city: normalizeCityExpr(),
        _type: normalizeTypeExpr(),
        _amount: amountExpr(),
        _date: dateFieldExpr(),
      },
    };

    const timeMatch = {
      $match: {
        _date: { $gte: from },
      },
    };

    const [summary] = await FOOD.aggregate([
      matchStage,
      commonAddFields,
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$_amount" },
          totalDonations: { $sum: 1 },
          vegCount: {
            $sum: { $cond: [{ $eq: ["$_type", "veg"] }, 1, 0] },
          },
          nonVegCount: {
            $sum: { $cond: [{ $eq: ["$_type", "non-veg"] }, 1, 0] },
          },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const trend = await FOOD.aggregate([
      matchStage,
      commonAddFields,
      timeMatch,
      {
        $group: {
          _id: { $dateToString: { format, date: "$_date" } },
          donationCount: { $sum: 1 },
          totalAmount: { $sum: "$_amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, period: "$_id", donationCount: 1, totalAmount: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        city,
        period,
        summary: summary || {
          totalAmount: 0,
          totalDonations: 0,
          vegCount: 0,
          nonVegCount: 0,
        },
        trend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getNgoInsights(req, res) {
  try {
    const period = clampPeriod(req.query.period);
    const { from, format } = periodConfig(period);

    const ngo = await RECEIVER.findById(req.user._id).select("pincode location name verificationStatus");
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }

    const prefix = String(ngo.pincode || "").slice(0, 4);
    if (!prefix) {
      return res.status(400).json({ success: false, message: "NGO pincode is required for nearby insights." });
    }

    const addFields = {
      $addFields: {
        _amount: amountExpr(),
        _type: normalizeTypeExpr(),
        _date: dateFieldExpr(),
        _area: { $substrCP: [{ $ifNull: ["$pincode", ""] }, 0, 4] }, // "nearby area" proxy
      },
    };

    // A) Nearby area insights (pending + accepted + completed/cancelled in same prefix)
    const nearbyArea = await FOOD.aggregate([
      addFields,
      { $match: { _area: prefix, _date: { $gte: from } } },
      {
        $group: {
          _id: "$pincode",
          donationCount: { $sum: 1 },
          totalAmount: { $sum: "$_amount" },
        },
      },
      { $sort: { donationCount: -1 } },
      { $limit: 12 },
      { $project: { _id: 0, areaLabel: "$_id", donationCount: 1, totalAmount: 1 } },
    ]);

    // B) NGO performance: received donations + trend
    const ngoId = new mongoose.Types.ObjectId(req.user._id);
    const [performance] = await FOOD.aggregate([
      { $match: { receiverId: ngoId } },
      addFields,
      {
        $group: {
          _id: null,
          totalReceived: { $sum: 1 },
          totalAmountReceived: { $sum: "$_amount" },
          vegReceived: { $sum: { $cond: [{ $eq: ["$_type", "veg"] }, 1, 0] } },
          nonVegReceived: { $sum: { $cond: [{ $eq: ["$_type", "non-veg"] }, 1, 0] } },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const trend = await FOOD.aggregate([
      { $match: { receiverId: ngoId } },
      addFields,
      { $match: { _date: { $gte: from } } },
      {
        $group: {
          _id: { $dateToString: { format, date: "$_date" } },
          receivedCount: { $sum: 1 },
          totalAmount: { $sum: "$_amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, period: "$_id", receivedCount: 1, totalAmount: 1 } },
    ]);

    const history = await FOOD.find({ receiverId: ngoId })
      .sort({ date: -1 })
      .limit(10)
      .select("_id name phone date totalCount status address foodType expiryTime pincode qrCodeDataUrl");

    res.status(200).json({
      success: true,
      data: {
        period,
        nearbyPrefix: prefix,
        nearbyArea,
        performance: performance || {
          totalReceived: 0,
          totalAmountReceived: 0,
          vegReceived: 0,
          nonVegReceived: 0,
        },
        trend,
        history,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getAdminInsights(req, res) {
  try {
    const period = clampPeriod(req.query.period);
    const { from, format } = periodConfig(period);

    const requestedCity = (req.query.city || "").trim().toLowerCase();

    const addFields = {
      $addFields: {
        _city: normalizeCityExpr(),
        _type: normalizeTypeExpr(),
        _amount: amountExpr(),
        _date: dateFieldExpr(),
      },
    };

    const basePipeline = [addFields, { $match: { _date: { $gte: from } } }];

    const cityMatch = requestedCity
      ? [{ $match: { $expr: { $eq: ["$_city", requestedCity] } } }]
      : [];

    const [totals] = await FOOD.aggregate([
      ...basePipeline,
      ...cityMatch,
      {
        $group: {
          _id: null,
          totalDonations: { $sum: 1 },
          totalAmount: { $sum: "$_amount" },
          vegCount: { $sum: { $cond: [{ $eq: ["$_type", "veg"] }, 1, 0] } },
          nonVegCount: { $sum: { $cond: [{ $eq: ["$_type", "non-veg"] }, 1, 0] } },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const cityStats = await FOOD.aggregate([
      ...basePipeline,
      {
        $group: {
          _id: "$_city",
          donationCount: { $sum: 1 },
          totalAmount: { $sum: "$_amount" },
          vegCount: { $sum: { $cond: [{ $eq: ["$_type", "veg"] }, 1, 0] } },
          nonVegCount: { $sum: { $cond: [{ $eq: ["$_type", "non-veg"] }, 1, 0] } },
        },
      },
      { $sort: { donationCount: -1 } },
      { $limit: 50 },
      {
        $project: {
          _id: 0,
          city: "$_id",
          donationCount: 1,
          totalAmount: 1,
          vegCount: 1,
          nonVegCount: 1,
        },
      },
    ]);

    const comparison = await FOOD.aggregate([
      ...basePipeline,
      {
        $group: {
          _id: "$_city",
          donationCount: { $sum: 1 },
        },
      },
      { $sort: { donationCount: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, city: "$_id", donationCount: 1 } },
    ]);

    const trend = await FOOD.aggregate([
      ...basePipeline,
      ...cityMatch,
      {
        $group: {
          _id: { $dateToString: { format, date: "$_date" } },
          donationCount: { $sum: 1 },
          totalAmount: { $sum: "$_amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, period: "$_id", donationCount: 1, totalAmount: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        city: requestedCity || null,
        totals: totals || { totalDonations: 0, totalAmount: 0, vegCount: 0, nonVegCount: 0 },
        cityStats,
        comparison,
        trend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getUserInsights,
  getNgoInsights,
  getAdminInsights,
};

