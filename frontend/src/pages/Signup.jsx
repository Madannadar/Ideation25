import { useState } from "react";
import { requestOtp, signup } from "../services/authService.js";

export default function Signup({ onAuth }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "patient",
        otp: "",
        dob: "",
        age: "",
        gender: "",
        address: "",
    });

    const [otpSent, setOtpSent] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (!form.phone) return alert("Please enter your phone number");
        const data = await requestOtp({ phone: form.phone });
        if (data.msg) {
            alert("OTP sent to your phone!");
            setOtpSent(true);
        } else {
            alert("Failed to send OTP");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!form.name || !form.gender || !form.password) {
            return alert("Please fill all required fields");
        }
        const data = await signup(form);
        if (data.token) {
            localStorage.setItem("token", data.token);
            onAuth(data.user);
        } else {
            alert(data.msg || "Signup failed");
        }
    };

    return (
        <form onSubmit={otpSent ? handleSignup : handleRequestOtp} className="space-y-2 p-4 border rounded shadow">
            <h2>Patient Signup</h2>

            {/* Basic Info */}
            <input name="name" placeholder="Full Name" onChange={handleChange} required />
            <input name="dob" type="date" placeholder="Date of Birth" onChange={handleChange} />
            <input name="age" type="number" placeholder="Age" onChange={handleChange} />
            <select name="gender" onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <input name="phone" type="text" placeholder="Phone Number" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email (optional)" onChange={handleChange} />
            <input name="address" placeholder="Address (optional)" onChange={handleChange} />

            {/* Password */}
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

            {/* Role */}
            <select name="role" onChange={handleChange}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
            </select>

            {/* OTP Field */}
            {otpSent && (
                <input name="otp" type="text" placeholder="Enter OTP" onChange={handleChange} required />
            )}

            <button type="submit">{otpSent ? "Verify & Signup" : "Send OTP"}</button>
        </form>
    );
}
