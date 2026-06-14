import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/user/user.routes";
import { profileRoute } from "./modules/profiles/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import { auth } from "./middlewares/auth.middleware";

import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./middlewares/error/globalErrorHanlder";



const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()) ;
app.use(cors({
  origin: "http://localhost:3000", // Adjust this to your frontend URL
  credentials: true, // Allow cookies to be sent with requests
})) ;

app.get("/", auth(), (req: Request, res: Response) => {
  res.status(200).send({
    message: "Hello Express Expert!",
  });
});

app.use("/users", userRoute);
app.use("/profiles", profileRoute);
app.use("/auth", authRoute);



// Global error handler
app.use(globalErrorHandler);

export default app;