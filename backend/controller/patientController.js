import Patient from "../model/Patient.js";

export const createPatientForm = async (req, res) => {
    try {
        const userId = req.user.id; // assuming JWT auth middleware adds req.user
        const data = req.body;

        const newForm = new Patient({
            ...data,
            user: userId,
        });

        await newForm.save();

        res.status(201).json({ msg: "Patient form submitted successfully", form: newForm });
    } catch (err) {
        res.status(500).json({ msg: "Error saving patient form", error: err.message });
    }
};

export const getPatientForms = async (req, res) => {
    try {
        const userId = req.user.id;
        const forms = await Patient.find({ user: userId }).sort({ createdAt: -1 });
        res.json(forms);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching patient forms", error: err.message });
    }
};
