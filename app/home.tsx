import AddPatientSheet from "@/components/AddPatientSheet";
import PatientCard from "@/components/PatientCard";
import { useUser } from "@/context/UserContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Patient } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB",
];

export default function PatientsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userData, addPatient, loading: contextLoading } = useUser();
  const router = useRouter();

  // We don't need local state for patients anymore, we use userData.patients
  const patients = userData?.patients || [];
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddPatient = async (newPatientData: {
    name: string;
    age: string;
    phone: string;
  }) => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addPatient(
        newPatientData.name,
        newPatientData.age,
        newPatientData.phone
      );
      setIsSheetOpen(false); // Close sheet only after success
    } catch (error) {
      console.error("Failed to add patient", error);
    } finally {
      setIsAdding(false);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: Patient }) => (
      <PatientCard
        patient={item}
        onPress={() =>
          router.push({ pathname: "/patient/[id]", params: { id: item.pid } })
        }
      />
    ),
    [router]
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000" : "#F2F2F7" }}>
      {/* Custom Header */}
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 16,
          paddingBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 34,
            fontFamily: "FunnelDisplay-Bold",
            color: isDark ? "#E0E0E0" : "#000",
          }}
        >
          Patients
        </Text>
      </View>

      {patients.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.5,
          }}
        >
          <Text
            style={{
              color: isDark ? "#E0E0E0" : "#000",
              fontSize: 18,
              fontFamily: "FunnelDisplay-Regular",
            }}
          >
            No patients found
          </Text>
        </View>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.pid}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          contentInsetAdjustmentBehavior="automatic"
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 42,
          right: 24,
          width: 66,
          height: 66,
          borderRadius: 33,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#D32F2F",
          // Shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
        onPress={() => setIsSheetOpen(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <AddPatientSheet
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onAddPatient={handleAddPatient}
        loading={isAdding}
      />
    </View>
  );
}
