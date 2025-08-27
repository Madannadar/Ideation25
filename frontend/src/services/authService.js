const API_URL = "http://localhost:5000/api/auth";

// Step 1: Request OTP for phone verification
export const requestOtp = async (payload) => {
    const res = await fetch(`${API_URL}/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return res.json();
};

// Step 2: Signup after OTP verification
export const signup = async (userData) => {
    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return res.json();
};

// Step 3: Login (email + password)
export const login = async (userData) => {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return res.json();
};
