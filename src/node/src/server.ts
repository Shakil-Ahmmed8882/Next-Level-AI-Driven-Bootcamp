import { createServer, IncomingMessage, ServerResponse, type Server } from "http";
import { routesHandler } from "./routes";


const server:Server  = createServer((req:IncomingMessage, res: ServerResponse) => routesHandler(req, res))

server.listen(5000, () => {
    console.log("Server is running on port 5000")
})