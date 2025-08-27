import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import twilio from "twilio";

const SECRET = toString(process.env.TOKEN_SECRET);
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const signup = async (req, res) => {
    try {
        const { name, email, password, role, phone, otp } = req.body;

        const user = await User.findOne({ phone });
        if (!user) return res.status(400).json({ msg: "User not found. Request OTP first" });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        user.name = name;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);
        user.role = role;
        user.otp = null;
        user.otpExpires = null;

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, user: { id: user._id, name, role } });
    } catch (err) {
        res.status(500).json({ msg: "Signup failed", error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ msg: "Login failed", error: err.message });
    }
};

export const requestOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) return res.status(400).json({ msg: "Phone required" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

        let user = await User.findOne({ phone });
        if (!user) {
            user = new User({ phone });
        }
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // ⚡ send OTP via SMS (Twilio/MSG91/any provider) → for now log
        console.log(`OTP for ${phone}: ${otp}`);

        res.json({ msg: "OTP sent successfully" });
    } catch (err) {
        res.status(500).json({ msg: "OTP request failed", error: err.message });
    }
};

export const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP

        // Save OTP in DB (or Redis for short expiry)
        await User.findOneAndUpdate(
            { phone },
            { phone, otp, otpExpires: Date.now() + 5 * 60 * 1000 },
            { upsert: true, new: true }
        );

        // Send via Twilio SMS
        await client.messages.create({
            body: `Your login OTP is ${otp}`,
            from: process.env.TWILIO_PHONE,
            to: phone,
        });

        res.json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        const user = await User.findOne({ phone });

        if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Clear OTP
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({
            success: true,
            message: "OTP verified",
            user: { id: user._id, phone: user.phone, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};