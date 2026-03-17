// const bcrypt = require('bcryptjs');
// const Admin = require('../models/adminModel');
// const { connectdb } = require('./connectDb');
// require('dotenv/config')

// const createInitialAdmin = async () => {
//     try {
//         // await connectdb("mongodb+srv://db_user:123@mealconnect.zy869q2.mongodb.net/?retryWrites=true&w=majority&appName=mealconnect");
//         await connectdb(process.env.MONGO_URL)
        
//         const adminData = {
//             email: "admin@mealconnect.com",
//             password: await bcrypt.hash("admin123", 10),
//             name: "Admin User",
//             role: "admin"
//         };

//         const existingAdmin = await Admin.findOne({ email: adminData.email });
//         if (!existingAdmin) {
//             await Admin.create(adminData);
//             console.log('Admin user created successfully');
//         } else {
//             console.log('Admin user already exists');
//         }
//     } catch (error) {
//         console.error('Error creating admin:', error);
//     }
//     process.exit();
// };

// createInitialAdmin(); 