export const configs = {
    PORT: process.env.PORT,
    JWT_SECRET: String(process.env.JWT_SECRET),
    MAIL_PASS: String(process.env.MAIL_PASS),
    MAIL_USER: String(process.env.MAIL_USER),
};

export const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

export const cookieOptions = {
    maxAge: 15 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? ("none" as const)
            : ("lax" as const),
    domain:
        process.env.NODE_ENV === "production"
            ? process.env.BACKEND_BASE_DOMAIN
            : "localhost",
};
