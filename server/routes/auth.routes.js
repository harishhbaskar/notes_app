import { Router } from "express";

import { signIn ,signOut , signUp ,getMe } from "../controllers/auth.controller.js";
import authorize from "../middleware/auth.middleware.js";

const authRouter = Router();


authRouter.post("/signin",signIn);
authRouter.post("/signup",signUp);
authRouter.post("/signout",signOut);
authRouter.get("/me", authorize, getMe);

export default authRouter;

