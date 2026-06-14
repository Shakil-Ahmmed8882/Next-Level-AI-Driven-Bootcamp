import { pool } from "../../db";
import becrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";


type payload = {
    email: string;
    password: string;
}


const loginUserIntoDB = async (payload: payload) => {
    const { email, password } = payload;

    // 1. check if user exists
    // 2. check if password is correct 
    // 3. generate token (JWT)
    const user = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email])
        
        const userData = user.rows[0]; 
    if(!userData) {
        throw new Error("User not found");
    }

    const isPasswordCorrect = becrypt.compare(password, userData.password); 
    if(!isPasswordCorrect){
        throw new Error("Invalid password");
    }
    
    // 
    const jwtPayload = {
        id: userData.id, 
        email: userData.email,
        role: userData.role
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt.access, { expiresIn: "1d" });
    const refreshToken = jwt.sign(jwtPayload, config.jwt.refresh, { expiresIn: "7d" });

    return {
        accessToken,
        refreshToken
    }





}

const generateRefreshToken = async (token: string) => {
    if(!token) {
        throw new Error("No token provided");
    }
    const decoded = jwt.verify(token, config.jwt.refresh) as unknown as payload;

    const user = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [decoded.email])

        if(!user.rows[0]) {
            throw new Error("User not found");
        }

        if(user.rows[0].is_active === false) {
            throw new Error("User account is inactive");
        }

        const userData = user.rows[0];
        
    const jwtPayload = {
        id: userData.id, 
        email: userData.email,
        role: userData.role
    }
    const accessToken = jwt.sign(jwtPayload, config.jwt.access, { expiresIn: "1d" });
    return {
        accessToken
    }
}

export const authServices = {
    loginUserIntoDB,
    generateRefreshToken
}