import { useState } from "react";
import { login } from "../services/authService";

export default function Login({ onAuth }) {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await login(form);

        if (data.token && data.user) {
            // ✅ Save both token and user
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // ✅ Pass user to parent (App)
            onAuth(data.user);
        } else {
            alert(data.msg || "Login failed");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl space-y-4"
        >
            <h2 className="text-2xl font-bold text-center text-blue-600">Login</h2>

            <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
            />

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
                Login
            </button>
        </form>
    );
}
