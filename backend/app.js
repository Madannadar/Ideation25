import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./route/auth.route.js";
import patientRoutes from "./route/patient.route.js";


dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:3000",  // allow React frontend
    credentials: true                 // if using cookies/sessions
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(5000, () => console.log("Server running on http://localhost:5000"));
    })
    .catch(err => console.error("DB connection error:", err));
