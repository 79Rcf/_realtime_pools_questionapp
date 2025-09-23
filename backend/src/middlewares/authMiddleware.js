import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        let token;

        if (
            req.header.authorization &&
            req.header.authorization.startWith("Bearer")
        ) {
            token = req.header.authorization.split( " " )[1];
        }

        if (!token) {
            return res.status(401).json({ error: "NOT AUTHORIZED, NO TOKEN" });
        }

        const decoded = jwt.verify(token, process.env.jwt_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        console.error(" AUTH ERROR", err.message);
        return res.status(401).json({ error: "NOT AUTHORIZED, TOKEN FAILEd " });
    }
};