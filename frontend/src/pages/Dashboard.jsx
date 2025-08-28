import { useNavigate } from "react-router-dom";

export default function Dashboard({ user, onLogout }) {
    const navigate = useNavigate();

    if (!user) return <h2 className="text-center text-xl mt-10">Please login</h2>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    Welcome, <span className="text-blue-600">{user.name}</span>
                </h2>

                {user.role === "doctor" ? (
                    <p className="text-gray-700">👨‍⚕️ Doctor Dashboard: Manage patients</p>
                ) : (
                    <>
                        <p className="text-gray-700">🧑‍🤝‍🧑 Patient Dashboard: View health records</p>
                        <button
                            onClick={() => navigate("/patient-form")}
                            className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                            Fill Patient Form
                        </button>
                    </>
                )}

                <button
                    onClick={onLogout}
                    className="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
