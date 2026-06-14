import path from "path";
import dotenv from "dotenv";

const envPath = path.join(process.cwd(), ".env");
console.log(envPath);
dotenv.config({
    path: envPath
})

const config = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL as string,
    jwt: {
        access: process.env.JWT_ACCESS_SECRET as string,
        refresh: process.env.JWT_REFRESH_SECRET as string
    }
}

export default config;