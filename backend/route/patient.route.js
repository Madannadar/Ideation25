import express from "express";
import { createPatientForm, getPatientForms } from "../controller/patientController.js";
import { authMiddleware } from "../middleware/auth.middleware.js"; // JWT check

const router = express.Router();

router.post("/", createPatientForm);
router.get("/", getPatientForms);

export default router;
