import { useState } from "react";

export default function PhoneLogin({ onAuth }) {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("phone"); // phone → otp

    const sendOtp = async () => {
        const res = await fetch("http://localhost:5000/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
        });
        const data = await res.json();
        if (data.success) setStep("otp");
        else alert(data.error);
    };

    const verifyOtp = async () => {
        const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, otp }),
        });
        const data = await res.json();
        if (data.success) onAuth(data.user);
        else alert(data.message);
    };

    return (
        <div>
            {step === "phone" && (
                <>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button onClick={sendOtp}>Send OTP</button>
                </>
            )}

            {step === "otp" && (
                <>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={verifyOtp}>Verify OTP</button>
                </>
            )}
        </div>
    );
}
