import express from "express";
import { login, requestOtp, sendOTP, signup, verifyOTP } from "../controller/auth.controller.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/request-otp", requestOtp);

export default router;
