import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, unique: true, sparse: true }, // sparse → allows multiple docs with null email
        password: { type: String },

        phone: { type: String, unique: true, sparse: true },

        role: { type: String, enum: ["patient", "doctor"], default: "patient" },

        // OTP-based login
        otp: { type: String },
        otpExpires: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
