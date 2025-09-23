import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// General limiter
export const generalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, try again in 5 minutes',
    standardHeaders: true,
    legacyHeaders: false
});

// Auth limiter (IP + email/username)
export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 7,
    message: "Too many login attempts. You have been restricted from this process for 10 minutes",
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req, res) => {
        const ip = ipKeyGenerator(req, res);
        const email = req.body.email || req.body.username || '';
        return `${ip}:${email}`;
    }
});
