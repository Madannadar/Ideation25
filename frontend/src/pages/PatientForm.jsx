import { useState } from "react";

export default function PatientForm({ onSubmit }) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "",
        contact: "",
        currentIllness: "",
        onsetDate: "",
        severity: "mild",
        medicalHistory: [],
        allergies: "",
        medications: "",
        vitals: { temperature: "", bp: "", pulse: "", respRate: "", oxygen: "" },
        symptoms: [],
        lifestyle: { smoking: false, alcohol: false, travel: "" },
        attachments: [],
        notes: "",
    });

    const symptomsOptions = [
        "Fever",
        "Cough",
        "Sore Throat",
        "Shortness of Breath",
        "Fatigue",
        "Headache",
        "Nausea / Vomiting",
        "Diarrhea",
        "Body Pains",
        "Chest Pain",
        "Skin Rashes",
        "Other",
    ];

    const medicalHistoryOptions = [
        "Diabetes",
        "Hypertension",
        "Asthma",
        "Heart Disease",
        "Kidney Disease",
        "Other",
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("vitals.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({ ...prev, vitals: { ...prev.vitals, [key]: value } }));
        } else if (name.startsWith("lifestyle.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                lifestyle: { ...prev.lifestyle, [key]: type === "checkbox" ? checked : value },
            }));
        } else if (name === "medicalHistory") {
            const newHistory = [...form.medicalHistory];
            if (checked) newHistory.push(value);
            else newHistory.splice(newHistory.indexOf(value), 1);
            setForm((prev) => ({ ...prev, medicalHistory: newHistory }));
        } else if (name === "symptoms") {
            const newSymptoms = [...form.symptoms];
            if (checked) newSymptoms.push(value);
            else newSymptoms.splice(newSymptoms.indexOf(value), 1);
            setForm((prev) => ({ ...prev, symptoms: newSymptoms }));
        } else setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, attachments: [...e.target.files] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
            {/* Step 1: Basic Info */}
            {step === 1 && (
                <>
                    <h2>Basic Information</h2>
                    <input name="name" placeholder="Full Name" onChange={handleChange} required />
                    <input name="age" type="number" placeholder="Age" onChange={handleChange} required />
                    <select name="gender" onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input name="contact" placeholder="Contact Number" onChange={handleChange} required />
                    <button type="button" onClick={handleNext}>Next</button>
                </>
            )}

            {/* Step 2: Current Illness */}
            {step === 2 && (
                <>
                    <h2>Current Illness & History</h2>
                    <textarea
                        name="currentIllness"
                        placeholder="Describe your current illness"
                        onChange={handleChange}
                        required
                    />
                    <input name="onsetDate" type="date" onChange={handleChange} />
                    <select name="severity" onChange={handleChange}>
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                        <option value="critical">Critical</option>
                    </select>
                    <div>
                        <label>Medical History:</label>
                        {medicalHistoryOptions.map((item) => (
                            <label key={item}>
                                <input
                                    type="checkbox"
                                    name="medicalHistory"
                                    value={item}
                                    onChange={handleChange}
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                    <textarea name="allergies" placeholder="Allergies" onChange={handleChange} />
                    <textarea name="medications" placeholder="Current Medications" onChange={handleChange} />
                    <button type="button" onClick={handleBack}>Back</button>
                    <button type="button" onClick={handleNext}>Next</button>
                </>
            )}

            {/* Step 3: Vitals & Symptoms */}
            {step === 3 && (
                <>
                    <h2>Vitals & Symptoms</h2>
                    <input name="vitals.temperature" placeholder="Body Temperature" onChange={handleChange} />
                    <input name="vitals.bp" placeholder="Blood Pressure (Systolic/Diastolic)" onChange={handleChange} />
                    <input name="vitals.pulse" placeholder="Pulse" onChange={handleChange} />
                    <input name="vitals.respRate" placeholder="Respiratory Rate" onChange={handleChange} />
                    <input name="vitals.oxygen" placeholder="Oxygen Saturation (%)" onChange={handleChange} />

                    <div>
                        <label>Symptoms:</label>
                        {symptomsOptions.map((item) => (
                            <label key={item}>
                                <input type="checkbox" name="symptoms" value={item} onChange={handleChange} />
                                {item}
                            </label>
                        ))}
                    </div>

                    <button type="button" onClick={handleBack}>Back</button>
                    <button type="button" onClick={handleNext}>Next</button>
                </>
            )}

            {/* Step 4: Lifestyle & Attachments */}
            {step === 4 && (
                <>
                    <h2>Lifestyle & Attachments</h2>
                    <label>
                        <input type="checkbox" name="lifestyle.smoking" onChange={handleChange} />
                        Smoking
                    </label>
                    <label>
                        <input type="checkbox" name="lifestyle.alcohol" onChange={handleChange} />
                        Alcohol
                    </label>
                    <input name="lifestyle.travel" placeholder="Recent Travel Details" onChange={handleChange} />
                    <input type="file" multiple onChange={handleFileChange} />

                    <textarea name="notes" placeholder="Additional Notes" onChange={handleChange} />

                    <button type="button" onClick={handleBack}>Back</button>
                    <button type="submit">Submit</button>
                </>
            )}
        </form>
    );
}
