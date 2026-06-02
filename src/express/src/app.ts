import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/user/user.routes";
import { profileRoute } from "./modules/profiles/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import { auth } from "./middlewares/auth.middleware";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", auth(), (req: Request, res: Response) => {
  res.status(200).send({
    message: "Hello Express Expert!",
  });
});

app.use("/users", userRoute);
app.use("/profiles", profileRoute);
app.use("/auth", authRoute);

export default app;