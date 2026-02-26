import "dotenv/config";

export const env = {
    port: process.env.PORT || 3000,
    databaseURL: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET
    
};

export const config = {
    prefix: "/api",
}
