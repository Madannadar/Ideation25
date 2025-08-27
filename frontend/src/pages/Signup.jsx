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
    });
    const [otpSent, setOtpSent] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRequestOtp = async (e) => {
        e.preventDefault();
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
        const data = await signup(form);
        if (data.token) {
            localStorage.setItem("token", data.token);
            onAuth(data.user);
        } else {
            alert(data.msg || "Signup failed");
        }
    };

    return (
        <form onSubmit={otpSent ? handleSignup : handleRequestOtp}>
            <h2>Signup</h2>
            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} />
            <input name="phone" type="text" placeholder="Phone Number" onChange={handleChange} />

            <select name="role" onChange={handleChange}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
            </select>

            {otpSent && (
                <input name="otp" type="text" placeholder="Enter OTP" onChange={handleChange} />
            )}

            <button type="submit">{otpSent ? "Verify & Signup" : "Send OTP"}</button>
        </form>
    );
}
