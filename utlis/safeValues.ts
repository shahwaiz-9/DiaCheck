// Define safe ranges
const SAFE_RANGES = {
  pregnancies: { min: 0, max: 20 },
  glucose: { min: 50, max: 300 },
  bloodPressure: { min: 40, max: 130 },
  skinThickness: { min: 5, max: 100 },
  insulin: { min: 0, max: 900 },
  bmi: { min: 10, max: 70 },
  diabetesPedigreeFunction: { min: 0.05, max: 2.5 },
  age: { min: 10, max: 100 },
};

// Function to validate the form
export function validateForm(values: {
  pregnancies: string;
  glucose: string;
  bloodPressure: string;
  skinThickness: string;
  insulin: string;
  bmi: string;
  diabetesPedigreeFunction: string;
  age: string;
}) {
  const errors: Record<string, string> = {};

  // Helper to check each field
  Object.entries(values).forEach(([key, value]) => {
    const stringValue = String(value || "");
    const numericValue = Number(value);

    if (stringValue.trim() === "") {
      errors[key] = "This field is required";
      return;
    }

    const range = SAFE_RANGES[key as keyof typeof SAFE_RANGES];
    if (!range) return;

    if (isNaN(numericValue)) {
      errors[key] = "Must be a number";
      return;
    }

    if (numericValue < range.min || numericValue > range.max) {
      errors[key] = `Value must be between ${range.min} and ${range.max}`;
    }
  });

  return errors;
}
