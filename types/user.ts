// Represents one diabetes test record
export interface DiabetesTest {
  tid: string;
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
  result: 0 | 1; // 0 = No Diabetes, 1 = Diabetes
  testDate: string;
}

// Patient information
export interface Patient {
  pid: string;
  name: string;
  Age: number;
  phone?: string;
  tests: DiabetesTest[]; // history of tests
}

// Logged-in user (doctor / main account holder)
export interface User {
  id: string;
  name?: string;
  email?: string;
  patients: Patient[];
  createdAt: string;
}
