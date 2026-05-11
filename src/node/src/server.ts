import { createServer, IncomingMessage, type Server } from "http";


const server:Server  = createServer((req:IncomingMessage) => {
    console.log(req)
})

server.listen(5000, () => {
    console.log("Server is running on port 5000")
})