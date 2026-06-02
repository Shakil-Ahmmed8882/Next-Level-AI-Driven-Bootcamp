import { createServer, IncomingMessage, ServerResponse, type Server } from "http";
import { routesHandler } from "./routes/routes";
import config from "./config";


const server:Server  = createServer((req:IncomingMessage, res: ServerResponse) => routesHandler(req, res))

server.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})