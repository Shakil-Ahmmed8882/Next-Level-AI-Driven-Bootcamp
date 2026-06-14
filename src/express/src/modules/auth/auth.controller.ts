import type { Request, Response } from "express";
import { authServices } from "./auth.service";


const loginUser = async (req: Request, res: Response) => {

    



    try {
        const result = await authServices.loginUserIntoDB(req.body);

        res.cookie("refreshToken", result.refreshToken, {
            secure: false, // production = true
            httpOnly: true,
        })


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


const refreshToken = async (req: Request, res: Response) => {
    
    const refreshToken = req.cookies.refreshToken as string;
    
    
    
    
    try {
        
        const result = await authServices.generateRefreshToken(refreshToken);
          res.status(200).send({
          message: "Refreshed token successfully",
          data: result,
        });
        
    } catch (error: any) {
        res.status(200).send({
            message: "Failed to refresh token",
            error: error.message || "Something went wrong",
        });



    }

     

}
export const authControllers = {
    loginUser,
    refreshToken
}