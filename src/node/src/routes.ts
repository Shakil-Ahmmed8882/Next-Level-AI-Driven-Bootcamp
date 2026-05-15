import type { IncomingMessage, ServerResponse } from "http";
import { productController } from "./controller/product.controller";



export const routesHandler = (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === "/products" && req.method === "GET") {
        productController(req, res)
        return; 
    }

    res.writeHead(404, {"content-type": "application/json"})
    res.end(JSON.stringify({ message: "Route not found" }))
}