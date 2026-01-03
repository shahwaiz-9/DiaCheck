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

      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? "#000" : "#F2F2F7",
        }}
      >
        <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
          data={patients}
          keyExtractor={(item) => item.pid}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons
                name="people-outline"
                size={64}
                color={isDark ? "#3A3A3C" : "#C7C7CC"}
              />
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 18,
                  fontFamily: "FunnelDisplay-Medium",
                  color: isDark ? "#8E8E93" : "#8E8E93",
                }}
              >
                No patients yet
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  fontFamily: "FunnelDisplay-Regular",
                  color: isDark ? "#636366" : "#AEAEB2",
                }}
              >
                Tap the + button to add your first patient
              </Text>
            </View>
          }
        />
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#D32F2F",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          elevation: 6,
        }}
        onPress={() => setIsSheetOpen(true)}
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Add Patient Sheet */}
      <AddPatientSheet
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onAddPatient={handleAddPatient}
        loading={isAdding}
      />
    </View>
  );
}
