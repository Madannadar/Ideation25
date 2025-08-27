export default function Dashboard({ user, onLogout }) {
    if (!user) return <h2>Please login</h2>;

    return (
        <div>
            <h2>Welcome, {user.name}</h2>

            {user.role === "doctor" ? (
                <p>Doctor Dashboard: Manage patients</p>
            ) : (
                <p>Patient Dashboard: View health records</p>
            )}

            <button onClick={onLogout} style={{ marginTop: "20px" }}>
                Logout
            </button>
        </div>
    );
}
