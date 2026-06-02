

import dotenv  from "dotenv";

dotenv.config({path: process.cwd() + "/.env"});

const config = {
    port: process.env.PORT, 
}

export default config;
