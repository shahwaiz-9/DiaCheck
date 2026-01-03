import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AuthLoadingScreen() {
  const router = useRouter();
  const { refreshData } = useUser();

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("Initializing user from Context...");
        await refreshData();
        console.log("User initialized");

        // Navigate to tabs (home is now inside tabs)
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Failed to initialize user", error);
      }
    };

    initialize();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <ActivityIndicator size="large" color="#D32F2F" />
      <Text style={{ marginTop: 20, fontSize: 16, color: "#666" }}>
        Setting up...
      </Text>
    </View>
  );
}
