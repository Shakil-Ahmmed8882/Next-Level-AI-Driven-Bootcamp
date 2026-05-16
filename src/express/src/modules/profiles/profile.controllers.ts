import type { Request, Response } from "express";
import { profileServices } from "./profile.services";
import type { ProfileInterface } from "./profile.interface";



const createProfile = async (req: Request, res: Response) => {
    
    try {
        const result = await profileServices.insertUserIntoDB(req.body as ProfileInterface);
        res.status(201).send({
            message: "Created profile successfully",
            data: result
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Something went wrong",
        });
        
    }

}

export const profileControllers = {
    createProfile
}