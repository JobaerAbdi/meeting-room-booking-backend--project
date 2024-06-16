import express from "express";
import validationRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { UserControllers } from "./user.controller";
const router = express.Router();

router.post("/signup",  
  validationRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser
 ); 


export const UserRoutes = router;