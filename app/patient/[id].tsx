import TestCard from "@/components/TestCard";
import { useUser } from "@/context/UserContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  BackHandler,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PatientDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { userData } = useUser();
  const patient = userData?.patients.find((p) => p.pid === id) || null;

  // MARK: - SYSTEM DEFAULT PRESS

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/(tabs)");

        return true; // Prevents the default back action
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      // Remove the listener when the screen is unfocused
      return () => subscription.remove();
    }, [])
  );

  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "#E57373",
      "#F06292",
      "#BA68C8",
      "#9575CD",
      "#7986CB",
      "#64B5F6",
      "#4FC3F7",
      "#4DD0E1",
      "#4DB6AC",
      "#81C784",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  if (!patient) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDark ? "#000" : "#F2F2F7",
        }}
      >
        <Text style={{ color: isDark ? "#E0E0E0" : "#000" }}>
          Patient not found.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "#007AFF" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const avatarColor = getAvatarColor(patient.name);
  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000" : "#F2F2F7" }}>
      <View style={{ flex: 1 }}>
        {/* Custom Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isDark ? "#2A2A2A" : "#F0F0F0",
              justifyContent: "center",
              alignItems: "center",
              // subtle depth
              shadowColor: "#000",
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#FFF" : "#000"}
            />
          </TouchableOpacity>

          <Text
            style={{
              flex: 1,
              fontSize: 24,
              fontFamily: "FunnelDisplay-Bold",
              textAlign: "center",
              color: isDark ? "#E0E0E0" : "#000",
              marginRight: 28,
            }}
          >
            Patient Details
          </Text>
        </View>

        {/* Content */}
        <FlatList
          data={patient.tests}
          keyExtractor={(item) => item.tid}
          renderItem={({ item }) => <TestCard test={item} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          ListHeaderComponent={() => (
            <View
              style={{ alignItems: "center", marginBottom: 24, marginTop: 10 }}
            >
              {/* Profile Section */}
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: avatarColor,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 36,
                    fontFamily: "FunnelDisplay-Bold",
                    color: "#FFF",
                  }}
                >
                  {initials}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 28,
                  fontFamily: "FunnelDisplay-Bold",
                  color: isDark ? "#E0E0E0" : "#000",
                  marginBottom: 4,
                }}
              >
                {patient.name}
              </Text>

              {/* <Text
                style={{
                  fontSize: 16,
                  color: isDark ? "#AEAEB2" : "#8E8E93",
                  fontFamily: "FunnelDisplay-Regular",
                }}
              >
                {patient.Age}
              </Text> */}
              {/* {patient.phone && (
                <Text
                  style={{
                    fontSize: 16,
                    color: isDark ? "#AEAEB2" : "#8E8E93",
                    fontFamily: "FunnelDisplay-Regular",
                  }}
                >
                  {patient.phone}
                </Text>
              )} */}

              {/* Insights Card */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/patient/insight",
                    params: { id },
                  })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  marginTop: 20,
                  marginBottom: 8,
                  borderRadius: 16,
                  width: "100%",
                  backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
                  borderWidth: isDark ? 0 : 1,
                  borderColor: isDark ? "transparent" : "#F5E6E6",
                }}
              >
                {/* Icon Container */}
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    marginTop: 8,
                    marginBottom: 8,
                    backgroundColor: isDark ? "#3A3A3C" : "#FEF2F2",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons
                    name="stats-chart"
                    size={22}
                    color={isDark ? "#EF4444" : "#DC2626"}
                  />
                </View>

                {/* Text */}
                <Text
                  style={{
                    flex: 1,
                    fontSize: 18,
                    fontFamily: "FunnelDisplay-SemiBold",
                    color: isDark ? "#E0E0E0" : "#1C1C1E",
                    letterSpacing: -0.2,
                  }}
                >
                  Insights
                </Text>

                {/* Arrow Icon */}
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: isDark ? "#3A3A3C" : "#F2F2F7",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={isDark ? "#FFFFFF" : "#1C1C1E"}
                  />
                </View>
              </TouchableOpacity>

              <View
                style={{
                  width: "100%",
                  alignItems: "flex-start",
                  marginTop: 16,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",

                    marginLeft: 10,
                  }}
                >
                  <View
                    style={{
                      width: 4,
                      height: 22,
                      borderRadius: 2,
                      backgroundColor: isDark ? "#D32F2F" : "#EF4444",
                      marginRight: 12,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: "FunnelDisplay-Bold",
                      color: isDark ? "#FFFFFF" : "#1C1C1E",
                      letterSpacing: -0.4,
                    }}
                  >
                    Diabetic Tests
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text
                style={{ color: isDark ? "#AEAEB2" : "#8E8E93", fontSize: 16 }}
              >
                No test history available.
              </Text>
            </View>
          )}
        />

        {/* FAB */}
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 42,
            right: 24,
            width: 66,
            height: 66,
            borderRadius: 33,
            backgroundColor: "#D32F2F",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 6,
          }}
          onPress={() =>
            router.push({
              pathname: "/patient/testInput",
              params: { id, age: patient?.Age },
            })
          }
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
