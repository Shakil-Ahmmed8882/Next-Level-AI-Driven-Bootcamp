import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/user/user.routes";
import { profileControllers } from "./modules/profiles/profile.controllers";
import { profileRoute } from "./modules/profiles/profile.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Hello Express Expert!",
  });
});

app.use("/users", userRoute);
app.use("/profiles", profileRoute);

export default app;