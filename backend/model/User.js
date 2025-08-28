import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // Basic info
        name: { type: String, required: true },
        dob: { type: Date },                     // Date of Birth
        age: { type: Number },                   // Optional if DOB is given
        gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
        email: { type: String, unique: true, sparse: true }, // Optional email
        phone: { type: String, unique: true, sparse: true }, // Optional phone

        // Address for remote follow-up
        address: { type: String },

        // Authentication
        password: { type: String },              // For password login
        otp: { type: String },                   // For OTP login
        otpExpires: { type: Date },

        // Role
        role: { type: String, enum: ["patient", "doctor"], default: "patient" },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
