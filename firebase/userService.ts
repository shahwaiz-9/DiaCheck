import { Patient } from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { db } from "./config";

const USER_ID_KEY = "user_id";

export interface UserData {
  uid: string;
  name?: string;
  email?: string;
  createdAt: string;
  patients: Patient[];
}

export const UserService = {
  /**
   * Initializes the user.
   * Checks for local UID.
   * If found, fetches data from Firebase.
   * If not found, generates new UID, saves locally, creates Firebase doc, and returns empty data.
   */
  initializeUser: async (): Promise<UserData> => {
    try {
      const storedUid = await AsyncStorage.getItem(USER_ID_KEY);

      if (storedUid) {
        console.log("Found local user ID:", storedUid);
        // Fetch data for existing user
        const userData = await UserService.getUserData(storedUid);
        if (userData) {
          return userData;
        } else {
          // Fallback if doc doesn't exist for some reason (rare)
          console.warn(
            "User ID key found but no Firestore doc. Re-initializing."
          );
          return await UserService.createNewUser(storedUid);
        }
      } else {
        console.log("No local user ID found. Creating new user.");
        return await UserService.createNewUser();
      }
    } catch (error) {
      console.error("Error initializing user:", error);
      throw error;
    }
  },

  createNewUser: async (existingUid?: string): Promise<UserData | null> => {
    console.log(
      `[createNewUser] 🚀 Starting process. existingUid provided: ${
        existingUid || "None"
      }`
    );

    const uid = existingUid || uuidv4();
    console.log(`[createNewUser] 🆔 Final UID to be used: ${uid}`);

    try {
      if (!existingUid) {
        console.log("[createNewUser] 💾 Saving UID to AsyncStorage...");
        await AsyncStorage.setItem(USER_ID_KEY, uid);
        console.log(
          "[createNewUser] ✅ UID saved to AsyncStorage successfully."
        );
      } else {
        console.log(
          "[createNewUser] ⏩ Skipping AsyncStorage (existing UID used)."
        );
      }

      const newUser: UserData = {
        uid,
        createdAt: Timestamp.now().toDate().toISOString(),
        patients: [],
      };

      console.log(
        `[createNewUser] ☁️ Attempting Firestore write: users/${uid}`
      );

      await setDoc(doc(db, "users", uid), {
        createdAt: newUser.createdAt,
      });

      console.log(
        "[createNewUser] 🎉 Firestore document created successfully!"
      );

      // 🏷️ Debug: Return data validation
      console.log(
        "[createNewUser] 📤 Returning newUser object:",
        JSON.stringify(newUser, null, 2)
      );
      return newUser;
    } catch (error) {
      // 🏷️ Debug: Detailed Error Logging
      console.error("❌ [createNewUser] CRITICAL ERROR:");
      if (error instanceof Error) {
        console.error(`- Message: ${error.message}`);
        console.error(`- Stack: ${error.stack}`);
      } else {
        console.error("- Unknown Error:", error);
      }
      return null;
    }
  },

  getUserData: async (uid: string): Promise<UserData | null> => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Fetch patients subcollection
        const patientsColRef = collection(db, "users", uid, "patients");
        const patientsSnapshot = await getDocs(patientsColRef);

        const patients: Patient[] = patientsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            pid: doc.id,
            name: data.name,
            Age: data.Age,
            phone: data.phone,
            tests: data.tests || [],
          } as Patient;
        });

        return {
          uid,
          name: userDoc.data().name,
          email: userDoc.data().email,
          createdAt: userDoc.data().createdAt,
          patients,
        };
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }

    return null;
  },

  /**
   * Adds a new patient to the user's patient collection.
   */
  addPatient: async (
    uid: string,
    patientData: Omit<Patient, "pid" | "tests">
  ): Promise<Patient> => {
    const newPid = uuidv4();
    const newPatient: Patient = {
      pid: newPid,
      ...patientData,
      tests: [],
    };

    try {
      console.log("Heres");
      // Add to 'patients' subcollection of the user
      await setDoc(doc(db, "users", uid, "patients", newPid), newPatient);
      console.log(`[addPatient] Added patient ${newPid} for user ${uid}`);
      return newPatient;
    } catch (error) {
      console.error("[addPatient] Error adding patient:", error);
      throw error;
    }
  },

  getPatient: async (uid: string, pid: string): Promise<Patient | null> => {
    try {
      const patientDocRef = doc(db, "users", uid, "patients", pid);
      const output = await getDoc(patientDocRef);

      if (output.exists()) {
        const data = output.data();
        return {
          pid: output.id,
          name: data.name,
          Age: data.Age,
          phone: data.phone,
          tests: data.tests || [],
        } as Patient;
      }
      return null;
    } catch (error) {
      console.error("[getPatient] Error fetching patient:", error);
      return null;
    }
  },

  /**
   * Adds a new diabetes test to a patient's record.
   */
  addTest: async (
    uid: string,
    pid: string,
    testData: Omit<import("@/types/user").DiabetesTest, "tid" | "testDate">
  ): Promise<import("@/types/user").DiabetesTest> => {
    const tid = uuidv4();
    const newTest: import("@/types/user").DiabetesTest = {
      tid,
      ...testData,
      testDate: new Date().toISOString(),
    };

    try {
      const patientRef = doc(db, "users", uid, "patients", pid);

      // We need to fetch the current patient data to append to the 'tests' array
      // Firestore arrayUnion could be used if 'tests' is an array field
      // but let's be safe and consistent with our data model
      const patientDoc = await getDoc(patientRef);

      if (patientDoc.exists()) {
        const currentTests = patientDoc.data().tests || [];
        const updatedTests = [newTest, ...currentTests];

        await setDoc(patientRef, { tests: updatedTests }, { merge: true });
        console.log(`[addTest] Added test ${tid} for patient ${pid}`);
        return newTest;
      } else {
        throw new Error("Patient not found");
      }
    } catch (error) {
      console.error("[addTest] Error adding test:", error);
      throw error;
    }
  },

  updateUserFields: async (
    uid: string,
    fields: { name?: string; email?: string }
  ): Promise<void> => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, fields, { merge: true });
      console.log(`[updateUserFields] Updated fields for user ${uid}`);
    } catch (error) {
      console.error("[updateUserFields] Error updating user fields:", error);
      throw error;
    }
  },
};
