import User from "../model/User.js";
import Otp from "../model/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import twilio from "twilio";

const SECRET = toString(process.env.TOKEN_SECRET);
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const signup = async (req, res) => {
    try {
        const { name, email, password, role, phone, otp, dob, age, gender, address } = req.body;

        // Verify OTP before creating account
        const record = await Otp.findOne({ phone });
        if (!record || record.otp !== otp || Date.now() > record.otpExpires) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        // Delete OTP after use
        await Otp.deleteOne({ phone });

        // Hash password
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "patient",
            phone,
            dob: dob ? new Date(dob) : undefined,
            age: age ? Number(age) : undefined,
            gender,
            address,
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "1h" });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                phone: user.phone,
                email: user.email,
                dob: user.dob,
                age: user.age,
                gender: user.gender,
                address: user.address,
            },
        });
    } catch (err) {
        console.error("Signup Error:", err);
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

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Save OTP in Otp collection
        let record = await Otp.findOne({ phone });
        if (!record) {
            record = new Otp({ phone, otp, otpExpires });
        } else {
            record.otp = otp;
            record.otpExpires = otpExpires;
        }
        await record.save();

        console.log(`OTP for ${phone}: ${otp}`); // For now, log it

        res.json({ msg: "OTP sent successfully" });
    } catch (err) {
        console.error("Request OTP Error:", err);
        res.status(500).json({ msg: "OTP request failed", error: err.message });
    }
};

export const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) return res.status(400).json({ success: false, error: "Phone is required" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

        // Save OTP in Otp collection
        await Otp.findOneAndUpdate(
            { phone },
            { otp, otpExpires },
            { upsert: true, new: true }
        );

        // Send OTP via Twilio (make sure phone format is +91XXXX)
        await client.messages.create({
            body: `Your login OTP is ${otp}`,
            from: process.env.TWILIO_PHONE,
            to: phone,
        });

        res.json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
        console.error("SendOTP Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        const record = await Otp.findOne({ phone });
        if (!record || record.otp !== otp || Date.now() > record.otpExpires) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // OTP is valid, delete it
        await Otp.deleteOne({ phone });

        // Optionally return user if exists
        let user = await User.findOne({ phone });
        if (!user) {
            user = { phone }; // minimal placeholder, you can enforce signup next
        }

        res.json({ success: true, message: "OTP verified", user });
    } catch (err) {
        console.error("VerifyOTP Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};