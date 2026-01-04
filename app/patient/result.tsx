import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ResultParams {
  id: string;
  result: string; // "0" or "1" passed as string in params often
  currentState: string;
  recommendation: string;
  // Metrics
  pregnancies: string;
  glucose: string;
  bloodPressure: string;
  skinThickness: string;
  insulin: string;
  bmi: string;
  diabetesPedigreeFunction: string;
  age: string;
  from: string;
}

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as unknown as ResultParams;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const isDiabetic = Number(params.result) === 1;
  const statusColor = isDiabetic ? "#D32F2F" : "#388E3C";
  const statusText = isDiabetic ? "High Risk" : "Normal";
  const iconName = isDiabetic ? "alert" : "checkmark";

  const handleNvaigation = () => {
    if (params.from === "testInput") {
      router.replace({
        pathname: "/patient/[id]",
        params: { id: params.id },
      });
    } else {
      router.back();
    }
  };

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <View
      style={{
        width: "48%",
        backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: isDark ? "transparent" : "#F2F2F7",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontFamily: "FunnelDisplay-Regular",
          color: isDark ? "#AEAEB2" : "#8E8E93",
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "FunnelDisplay-SemiBold",
          color: isDark ? "#E0E0E0" : "#1C1C1E",
        }}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000000" : "#F2F2F7" }}>
      {/* Header - Copied style from patient/[id].tsx */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "ios" ? 60 : 16,
          paddingBottom: 12,
          backgroundColor: isDark ? "#000000" : "#F2F2F7",
        }}
      >
        <TouchableOpacity
          onPress={() => handleNvaigation()}
          activeOpacity={0.7}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: isDark ? 0 : 1,
            borderColor: isDark ? "transparent" : "#E5E5EA",
            shadowColor: "#000",
            shadowOpacity: isDark ? 0.5 : 0.08,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
          }}
        >
          <Ionicons
            name="close"
            size={24}
            color={isDark ? "#FFFFFF" : "#1C1C1E"}
          />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontFamily: "FunnelDisplay-Bold",
            textAlign: "center",
            color: isDark ? "#FFFFFF" : "#1C1C1E",
            marginRight: 44, // Balance the close button
            letterSpacing: -0.5,
          }}
        >
          Results
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Result Indicator */}
        <View style={{ alignItems: "center", marginVertical: 24 }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: isDiabetic
                ? "rgba(211, 47, 47, 0.1)"
                : "rgba(56, 142, 60, 0.1)",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name={iconName} size={64} color={statusColor} />
          </View>
          <Text
            style={{
              fontSize: 32,
              fontFamily: "FunnelDisplay-Bold",
              color: statusColor,
              letterSpacing: -0.5,
            }}
          >
            {statusText}
          </Text>
        </View>

        {/* AI Analysis Section */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "FunnelDisplay-Bold",
              color: isDark ? "#FFFFFF" : "#1C1C1E",
              marginBottom: 16,
            }}
          >
            AI Analysis
          </Text>

          <View
            style={{
              backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
              padding: 16,
              borderRadius: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "FunnelDisplay-SemiBold",
                color: isDark ? "#E0E0E0" : "#1C1C1E",
                marginBottom: 8,
              }}
            >
              Current State
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "FunnelDisplay-Regular",
                color: isDark ? "#AEAEB2" : "#636366",
                lineHeight: 22,
              }}
            >
              {params.currentState || "Analysis not available."}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
              padding: 16,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "FunnelDisplay-SemiBold",
                color: isDark ? "#E0E0E0" : "#1C1C1E",
                marginBottom: 8,
              }}
            >
              Recommendation
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "FunnelDisplay-Regular",
                color: isDark ? "#AEAEB2" : "#636366",
                lineHeight: 22,
              }}
            >
              {params.recommendation || "No recommendations available."}
            </Text>
          </View>
        </View>

        {/* Metrics Section */}
        <View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "FunnelDisplay-Bold",
              color: isDark ? "#FFFFFF" : "#1C1C1E",
              marginBottom: 16,
            }}
          >
            Input Metrics
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <DetailItem label="Glucose" value={`${params.glucose} mg/dL`} />
            <DetailItem
              label="Blood Pressure"
              value={`${params.bloodPressure} mm Hg`}
            />
            <DetailItem label="BMI" value={`${params.bmi} kg/m²`} />
            <DetailItem label="Insulin" value={`${params.insulin} μU/mL`} />
            <DetailItem
              label="Skin Thickness"
              value={`${params.skinThickness} mm`}
            />
            <DetailItem label="Pregnancies" value={params.pregnancies} />
            <DetailItem
              label="Diabetes Pedigree"
              value={params.diabetesPedigreeFunction}
            />
            <DetailItem label="Age" value={params.age} />
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isDark ? "#D32F2F" : "#EF4444",
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: "center",
            marginTop: 24,
          }}
          onPress={() => handleNvaigation()}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 17,
              fontFamily: "FunnelDisplay-Bold",
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
