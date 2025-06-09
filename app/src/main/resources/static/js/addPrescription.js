import { savePrescription, getPrescription } from "./services/prescriptionServices.js";

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById("prescriptionForm");
    const patientNameInput = document.getElementById("patientNameInput");
    const medicinesInput = document.getElementById("medicines");
    const dosageInput = document.getElementById("dosage");
    const notesInput = document.getElementById("notes");
    const heading = document.getElementById("heading");
    const savePrescriptionBtn = document.getElementById("savePrescription");

    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get("appointmentId");
    const mode = urlParams.get("mode");
    const token = localStorage.getItem("token");
    const patientName = urlParams.get("patientName");

    // Validate required query parameters and token
    if (!appointmentId) {
        alert("❌ Appointment ID not found in URL.");
        selectRole('doctor');
        return;
    }
    if (!token) {
        alert("❌ Authentication token not found. Please log in.");
        selectRole('doctor');
        return;
    }

    // Update heading based on mode
    if (heading) {
        if (mode === "view") {
            heading.innerHTML = `View <span>Prescription</span>`;
        } else {
            heading.innerHTML = `Add <span>Prescription</span>`;
        }
    }

    // Pre-fill patient name
    if (patientNameInput && patientName) {
        patientNameInput.value = patientName;
    } else if (!patientNameInput) {
        console.error("Patient name input field not found");
    }

    // Fetch and pre-fill existing prescription if it exists
    if (appointmentId && token) {
        try {
            const response = await getPrescription(appointmentId, token);
            console.log("getPrescription :: ", response);

            if (response.prescription && response.prescription.length > 0) {
                const existingPrescription = response.prescription[0];
                patientNameInput.value = existingPrescription.patientName || patientName || "You";
                medicinesInput.value = existingPrescription.medication || "";
                dosageInput.value = existingPrescription.dosage || "";
                notesInput.value = existingPrescription.doctorNotes || "";
            }
        } catch (error) {
            console.warn("No existing prescription found or failed to load:", error);
        }
    }

    // Make fields read-only in view mode
    if (mode === 'view') {
        patientNameInput.disabled = true;
        medicinesInput.disabled = true;
        dosageInput.disabled = true;
        notesInput.disabled = true;
        savePrescriptionBtn.style.display = "none";
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Ensure all elements are present
            if (!patientNameInput || !medicinesInput || !dosageInput || !notesInput) {
                console.error("One or more form elements are missing:", {
                    patientNameInput,
                    medicinesInput,
                    dosageInput,
                    notesInput
                });
                alert("❌ Form elements are missing. Please try again.");
                return;
            }

            // Ensure patient name is set
            patientNameInput.value = patientName || "You";

            const prescription = {
                patientName: patientNameInput.value || "",
                medication: medicinesInput.value || "",
                dosage: dosageInput.value || "",
                doctorNotes: notesInput.value || "",
                appointmentId: appointmentId
            };

            console.log("pre", prescription);

            try {
                const { success, message } = await savePrescription(prescription, token);
                if (success) {
                    alert("✅ Prescription saved successfully.");
                    selectRole('doctor');
                } else {
                    alert("❌ Failed to save prescription. " + message);
                }
            } catch (error) {
                console.error("Error submitting prescription:", error);
                alert("An error occurred. Please try again later.");
            }
        });
    } else {
        console.error("Prescription form not found");
    }
});