type FormValues = {
  pregnancies: string;
  glucose: string;
  bloodPressure: string;
  skinThickness: string;
  insulin: string;
  bmi: string;
  diabetesPedigreeFunction: string;
  age?: string; // optional if you add it later
};

type PredictionResponse = {
  prediction: number; // assuming your API returns a numeric prediction
  [key: string]: any; // any extra fields
};

export async function submitDiabetesPrediction(
  formValues: FormValues
): Promise<PredictionResponse> {
  // Map camelCase to snake_case for API
  const payload = {
    pregnancies: Number(formValues.pregnancies),
    glucose: Number(formValues.glucose),
    blood_pressure: Number(formValues.bloodPressure),
    skin_thickness: Number(formValues.skinThickness),
    insulin: Number(formValues.insulin),
    bmi: Number(formValues.bmi),
    diabetes_pedigree: Number(formValues.diabetesPedigreeFunction),
    age: formValues.age ? Number(formValues.age) : 30, // default age if missing
  };

  try {
    const response = await fetch(
      "https://diacheck-official-model.onrender.com/api/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: PredictionResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Prediction API call failed:", error);
    throw error;
  }
}
