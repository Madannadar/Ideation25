import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ secure env variable
        req.user = decoded; // decoded will contain { id, role } if you signed it that way
        next();
    } catch (err) {
        return res.status(403).json({ msg: "Invalid or expired token" });
    }
};
