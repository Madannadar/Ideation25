import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        // Step 1: Basic Info
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
        contact: { type: String, required: true },

        // Step 2: Current Illness
        currentIllness: { type: String, required: true },
        onsetDate: { type: Date },
        severity: {
            type: String,
            enum: ["mild", "moderate", "severe", "critical"],
            default: "mild",
        },
        medicalHistory: [{ type: String }],
        allergies: { type: String },
        medications: { type: String },

        // Step 3: Vitals & Symptoms
        vitals: {
            temperature: String,
            bp: String,
            pulse: String,
            respRate: String,
            oxygen: String,
        },
        symptoms: [{ type: String }],

        // Step 4: Lifestyle & Attachments
        lifestyle: {
            smoking: { type: Boolean, default: false },
            alcohol: { type: Boolean, default: false },
            travel: String,
        },
        attachments: [{ type: String }], // file URLs (upload later)
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
