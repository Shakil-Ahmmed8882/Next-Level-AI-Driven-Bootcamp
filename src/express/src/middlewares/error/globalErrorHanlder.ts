import type { Request, Response } from "express";


const globalErrorHandler = (err: Error, _req: Request, res: Response) => {
    
    res.status(500).send({
        message: err.message || "Something went wrong",
    });
}

export default globalErrorHandler;