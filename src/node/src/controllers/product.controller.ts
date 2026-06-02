import type { IncomingMessage, ServerResponse } from "http"
import { getProducts, insertProduct, type TProduct } from "../services/products.services"
import { parseBody } from "../utils/parseBody";


export const productController = async (req: IncomingMessage, res: ServerResponse) => {

    const method = req.method;
    const url = req.url;
    const id = url?.split("/")[2];
    
    

    try {
        if (method === "GET" && url === "/products") {
            const products = getProducts();
            res.writeHead(200, {"content-type": "application/json"});
            res.end(JSON.stringify(products));
        } else if (method === "POST" && url === "/products") {
            const body: TProduct = await parseBody<TProduct>(req);
            insertProduct(body);
            res.writeHead(201, {"content-type": "application/json"});
            res.end(JSON.stringify({ message: "Product created successfully" }));
        } else if(method === "PUT" && url === `/products/${id}`) {
            res.end(JSON.stringify({ message: `Update product with id ${id}` }));
        
        } else {
            res.writeHead(404, {"content-type": "application/json"});
            res.end(JSON.stringify({ error: "Not found" }));
        }
    } catch (error) {
        console.error("Error:", error);
        res.writeHead(500, {"content-type": "application/json"});
        res.end(JSON.stringify({ error: "Internal server error" }));
    }
}