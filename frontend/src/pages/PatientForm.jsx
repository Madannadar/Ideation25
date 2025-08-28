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
        "Fever", "Cough", "Sore Throat", "Shortness of Breath", "Fatigue",
        "Headache", "Nausea / Vomiting", "Diarrhea", "Body Pains", "Chest Pain",
        "Skin Rashes", "Other",
    ];

    const medicalHistoryOptions = [
        "Diabetes", "Hypertension", "Asthma", "Heart Disease", "Kidney Disease", "Other",
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
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6"
        >
            <h2 className="text-2xl font-bold text-center text-blue-600">
                Patient Registration - Step {step}
            </h2>

            {/* Step 1: Basic Info */}
            {step === 1 && (
                <div className="space-y-4">
                    <input name="name" placeholder="Full Name" onChange={handleChange} required
                        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200" />
                    <input name="age" type="number" placeholder="Age" onChange={handleChange} required
                        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200" />
                    <select name="gender" onChange={handleChange} required
                        className="w-full p-2 border rounded-md">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input name="contact" placeholder="Contact Number" onChange={handleChange} required
                        className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200" />

                    <button type="button" onClick={handleNext}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Next →
                    </button>
                </div>
            )}

            {/* Step 2: Current Illness */}
            {step === 2 && (
                <div className="space-y-4">
                    <textarea
                        name="currentIllness"
                        placeholder="Describe your current illness"
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                    <input name="onsetDate" type="date" onChange={handleChange}
                        className="w-full p-2 border rounded-md" />
                    <select name="severity" onChange={handleChange}
                        className="w-full p-2 border rounded-md">
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                        <option value="critical">Critical</option>
                    </select>

                    <div className="space-y-2">
                        <p className="font-medium">Medical History:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {medicalHistoryOptions.map((item) => (
                                <label key={item} className="flex items-center space-x-2">
                                    <input type="checkbox" name="medicalHistory" value={item} onChange={handleChange} />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <textarea name="allergies" placeholder="Allergies" onChange={handleChange}
                        className="w-full p-2 border rounded-md" />
                    <textarea name="medications" placeholder="Current Medications" onChange={handleChange}
                        className="w-full p-2 border rounded-md" />

                    <div className="flex justify-between">
                        <button type="button" onClick={handleBack}
                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">← Back</button>
                        <button type="button" onClick={handleNext}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next →</button>
                    </div>
                </div>
            )}

            {/* Step 3: Vitals & Symptoms */}
            {step === 3 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <input name="vitals.temperature" placeholder="Temperature" onChange={handleChange}
                            className="p-2 border rounded-md" />
                        <input name="vitals.bp" placeholder="Blood Pressure" onChange={handleChange}
                            className="p-2 border rounded-md" />
                        <input name="vitals.pulse" placeholder="Pulse" onChange={handleChange}
                            className="p-2 border rounded-md" />
                        <input name="vitals.respRate" placeholder="Respiratory Rate" onChange={handleChange}
                            className="p-2 border rounded-md" />
                        <input name="vitals.oxygen" placeholder="Oxygen Saturation (%)" onChange={handleChange}
                            className="p-2 border rounded-md" />
                    </div>

                    <div className="space-y-2">
                        <p className="font-medium">Symptoms:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {symptomsOptions.map((item) => (
                                <label key={item} className="flex items-center space-x-2">
                                    <input type="checkbox" name="symptoms" value={item} onChange={handleChange} />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button type="button" onClick={handleBack}
                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">← Back</button>
                        <button type="button" onClick={handleNext}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next →</button>
                    </div>
                </div>
            )}

            {/* Step 4: Lifestyle & Attachments */}
            {step === 4 && (
                <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="lifestyle.smoking" onChange={handleChange} />
                            <span>Smoking</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="lifestyle.alcohol" onChange={handleChange} />
                            <span>Alcohol</span>
                        </label>
                    </div>
                    <input name="lifestyle.travel" placeholder="Recent Travel Details" onChange={handleChange}
                        className="w-full p-2 border rounded-md" />
                    <input type="file" multiple onChange={handleFileChange}
                        className="w-full p-2 border rounded-md" />

                    <textarea name="notes" placeholder="Additional Notes" onChange={handleChange}
                        className="w-full p-2 border rounded-md" />

                    <div className="flex justify-between">
                        <button type="button" onClick={handleBack}
                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">← Back</button>
                        <button type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Submit ✔</button>
                    </div>
                </div>
            )}
        </form>
    );
}
