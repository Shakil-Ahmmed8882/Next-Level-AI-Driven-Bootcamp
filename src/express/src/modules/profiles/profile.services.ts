import { pool } from "../../db";
import type { ProfileInterface } from "./profile.interface";


const insertUserIntoDB = async (profile: ProfileInterface) => {
    const result =  await pool.query(
        `INSERT INTO profile(user_id, bio, phone, address, gender, avatar_url)
         VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [profile.user_id, profile.bio, profile.phone, profile.address, profile.gender, profile.avatar_url]
    );


    return result.rows[0];
}

export const profileServices = {
    insertUserIntoDB
}