import type { IncomingMessage, ServerResponse } from "http"


export const productController = (req: IncomingMessage, res: ServerResponse) => {
        res.writeHead(200, {"content-type": "application/json"})
        res.end(JSON.stringify({ message: "Product controller is working!" }))
}