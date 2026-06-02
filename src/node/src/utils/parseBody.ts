import type { IncomingMessage } from "http";

export const parseBody = <T>(req: IncomingMessage): Promise<T> => {
    return new Promise((resolve, reject) => {
        let body = ""; 
        req.on("data", (chunk) => {
            body += chunk; 
        })

        req.on("end", () => {
            try {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody);
            } catch (error) {
                reject(error);
            }
        })
    })
}