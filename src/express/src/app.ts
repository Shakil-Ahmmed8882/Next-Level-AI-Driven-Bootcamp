import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/user/user.routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Hello Express Expert!",
  });
});

app.use("/users", userRoute);

export default app;