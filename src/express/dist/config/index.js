import path from "path";
import dotenv from "dotenv";
const envPath = path.join(process.cwd(), ".env");
console.log(envPath);
dotenv.config({
    path: envPath
});
const config = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL
};
export default config;
//# sourceMappingURL=index.js.map