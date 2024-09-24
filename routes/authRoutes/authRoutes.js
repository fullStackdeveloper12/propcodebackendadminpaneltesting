import express from "express";
import {
  SIGNUP,
  SIGNIN,
  GOOGLESIGNIN,
  FORGOTPASSWORD,
  RESETPASSWORD,
  UPDATE_PROFILE,
  DELETE_PROFILE,
  LOGOUT,
  VALIDATE_RESET_TOKEN,
} from "../../controllers/authcontroller/authcontroller.js";

const authRouter = express.Router();

authRouter.post("/signup", SIGNUP);
authRouter.post("/signin", SIGNIN);
authRouter.post("/googlesignin", GOOGLESIGNIN);
authRouter.post("/forgotpassword", FORGOTPASSWORD);
authRouter.post("/resetpassword/:token", RESETPASSWORD);
authRouter.get("/resetpassword/validate/:token", VALIDATE_RESET_TOKEN);
authRouter.put("/updateprofile", UPDATE_PROFILE);
authRouter.delete("/deleteprofile", DELETE_PROFILE);
authRouter.post("/logout", LOGOUT);

export default authRouter;
