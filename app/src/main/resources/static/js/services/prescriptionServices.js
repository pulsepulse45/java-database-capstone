const PRESCRIPTION_API = "/prescription";

export async function savePrescription(prescription, token) {
    try {
        const response = await fetch(`${PRESCRIPTION_API}/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prescription)
        });
        console.log(`Prescriptions data:`, prescription);
        console.log(`Prescriptions token:`, token);

        const result = await response.json();
        return { success: response.ok, message: result.message || (response.ok ? "Prescription saved successfully" : "Failed to save prescription") };
    } catch (error) {
        console.error("Error :: savePrescription ::", error);
        return { success: false, message: "Network error. Please try again later." };
    }
}

export async function getPrescription(appointmentId, token) {
    try {
        const response = await fetch(`${PRESCRIPTION_API}/${appointmentId}/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to fetch prescription:", errorData);
            throw new Error(errorData.message || "Unable to fetch prescription");
        }

        const result = await response.json();
        console.log("getPrescription result:", result);
        return result;
    } catch (error) {
        console.error("Error :: getPrescription ::", error);
        throw error;
    }
}