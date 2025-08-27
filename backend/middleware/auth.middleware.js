import jwt from "jsonwebtoken";

const SECRET = "SUPER_SECRET_KEY"; // ⚠️ Use process.env.SECRET

export const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
