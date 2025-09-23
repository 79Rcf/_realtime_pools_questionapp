import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ error: "NOT AUTHORIZED, NO TOKEN" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        req.user = decoded;

        next();
    } catch (error) {
        console.error("AUTH ERROR", error.message);
        return res.status(401).json({ error: "NOT AUTHORIZED, TOKEN FAILED" });
    }
};
