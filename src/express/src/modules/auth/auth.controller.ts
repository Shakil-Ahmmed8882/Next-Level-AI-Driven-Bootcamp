import type { Request, Response } from "express";
import { authServices } from "./auth.service";


const loginUser = async (req: Request, res: Response) => {

    



    try {
        const result = await authServices.loginUserIntoDB(req.body);
          res.status(200).send({
          message: "Updated user successfully",
          data: result,
        });
        
    } catch (error: any) {
        res.status(200).send({
            message: "Updated user successfully",
            error: error.message || "Something went wrong",
        });



    }



}

export const authControllers = {
    loginUser
}