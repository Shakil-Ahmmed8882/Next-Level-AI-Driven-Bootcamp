
import dotenv from "dotenv";

console.log(process.cwd() + ".env")
dotenv.config({
    path: process.cwd() + ".env"
})

const config = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL || ""
}

export default config;