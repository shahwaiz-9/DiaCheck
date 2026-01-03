import { UserData, UserService } from "@/firebase/userService";
import React, { createContext, ReactNode, useContext, useState } from "react";

// Define context shape
interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  setUserData: (data: UserData) => void;
  addPatient: (name: string, age: string, phone: string) => Promise<void>;
  addTest: (
    pid: string,
    testData: Omit<import("@/types/user").DiabetesTest, "tid" | "testDate">
  ) => Promise<void>;
  refreshData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await UserService.initializeUser();
      setUserData(data);
    } catch (error) {
      console.error("Failed to refresh user data", error);
    } finally {
      setLoading(false);
    }
  };
  
  const addPatient = async (name: string, age: string, phone: string) => {
    if (!userData) return;

    // 1. Optimistic Update (optional, but good for performance perception)
    // However, we need the real ID from the service usually.
    // But UserService generates the ID client-side (uuidv4), so we COULD do it.
    // For safety, let's await the service, but since we want "No IO calls afterward"
    // we essentially mean we don't re-fetch the list. We just append the result.

    try {
      const newPatient = await UserService.addPatient(userData.uid, {
        name,
        Age: parseInt(age, 10),
        phone,
      });

      setUserData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          patients: [newPatient, ...prev.patients],
        };
      });
    } catch (error) {
      console.error("Context: Failed to add patient", error);
      throw error;
    }
  };

  const addTest = async (
    pid: string,
    testData: Omit<import("@/types/user").DiabetesTest, "tid" | "testDate">
  ) => {
    if (!userData) return;

    try {
      const newTest = await UserService.addTest(userData.uid, pid, testData);

      setUserData((prev) => {
        if (!prev) return null;

        // Find the patient and update their tests
        const updatedPatients = prev.patients.map((p) => {
          if (p.pid === pid) {
            return {
              ...p,
              tests: [newTest, ...p.tests],
            };
          }
          return p;
        });

        return {
          ...prev,
          patients: updatedPatients,
        };
      });
    } catch (error) {
      console.error("Context: Failed to add test", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        loading,
        setUserData,
        addPatient,
        addTest,
        refreshData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
