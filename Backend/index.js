const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv/config')
const donorRoutes = require("./routes/donorRoutes.js");
const receiverRoutes = require("./routes/receiverRoutes.js");
const foodRoutes = require("./routes/foodRoutes.js");
const analyticsRoutes = require("./routes/analyticsRoutes.js");
const contactRoutes = require("./routes/contactRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const insightsRoutes = require("./routes/insights.js");
const authRoutes = require("./routes/authRoutes.js");

const {connectdb} = require("./utility/connectDb.js");

// Connect to MongoDB
connectdb(process.env.MONGO_URL);

// Dynamic CORS configuration supporting Vercel previews and production
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            process.env.NODE_ENV !== 'production'
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure DB is connected for serverless invocations
app.use(async (req, res, next) => {
    try {
        await connectdb(process.env.MONGO_URL);
        next();
    } catch (err) {
        console.error("MongoDB connection error in request middleware:", err);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/donor", donorRoutes);
app.use("/api/receiver", receiverRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.json("welcome to MealConnect");
}); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;