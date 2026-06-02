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
        email: userData.email
    }
    const accessToken = jwt.sign(jwtPayload, config.jwtSecret, { expiresIn: "1h" });

    return {
        accessToken
    }





}

export const authServices = {
    loginUserIntoDB
}