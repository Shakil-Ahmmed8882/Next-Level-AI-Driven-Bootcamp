import type { IncomingMessage, ServerResponse } from "http";
import { productController } from "../controllers/product.controller";



export const routesHandler = async(req: IncomingMessage, res: ServerResponse) => {
    await productController(req, res); 
    // res.writeHead(404, {"content-type": "application/json"})
    // res.end(JSON.stringify({ message: "Route not found" }))
}