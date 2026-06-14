import type { Response } from "express";

type SendResponseData<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T | null;
    error?: any;
};


const sendResponse = <T>(res: Response, data: SendResponseData<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data ?? null,
        error: data.error ?? null,
    });
}

export default sendResponse;