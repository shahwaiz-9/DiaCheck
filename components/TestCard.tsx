import { useColorScheme } from "@/hooks/use-color-scheme";
import { DiabetesTest } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TestCardProps {
  id: string;
  test: DiabetesTest;
}

const TestCard: React.FC<TestCardProps> = ({ id, test }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const isDiabetes = test.result === 1;
  const statusColor = isDiabetes ? "#D32F2F" : "#388E3C"; // Red for Diabetes, Green for Normal
  const statusText = isDiabetes ? "High Risk" : "Normal";
  const iconName = isDiabetes ? "alert-circle" : "checkmark-circle";

  // Format date efficiently
  const date = new Date(test.testDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const DetailItem = ({
    label,
    value,
    unit,
  }: {
    label: string;
    value: number | string;
    unit?: string;
  }) => (
    <View style={{ width: "48%", marginBottom: 12 }}>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "FunnelDisplay-Regular",
          color: isDark ? "#AEAEB2" : "#8E8E93",
          marginBottom: 2,
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
        {value}{" "}
        <Text
          style={{
            fontSize: 12,
            fontFamily: "FunnelDisplay-Regular",
            color: isDark ? "#636366" : "#8E8E93",
          }}
        >
          {unit}
        </Text>
      </Text>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/patient/result",
          params: {
            id: id,
            result: test.result,
            currentState: test.currentState,
            recommendation: test.recommendation,
            pregnancies: test.pregnancies,
            glucose: test.glucose,
            bloodPressure: test.bloodPressure,
            skinThickness: test.skinThickness,
            insulin: test.insulin,
            bmi: test.bmi,
            diabetesPedigreeFunction: test.diabetesPedigreeFunction,
            age: test.age,
          },
        })
      }
      style={{
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: isDark ? "#2C2C2E" : "#F2F2F7",
      }}
    >
      {/* Header - Date & Status */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#2C2C2E" : "#F2F2F7",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "FunnelDisplay-SemiBold",
              color: isDark ? "#E0E0E0" : "#1C1C1E",
            }}
          >
            Test Result
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "FunnelDisplay-Regular",
              color: isDark ? "#8E8E93" : "#8E8E93",
              marginTop: 2,
            }}
          >
            {date}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDiabetes
              ? "rgba(211, 47, 47, 0.1)"
              : "rgba(56, 142, 60, 0.1)",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Ionicons
            name={iconName}
            size={16}
            color={statusColor}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontSize: 13,
              fontFamily: "FunnelDisplay-Bold",
              color: statusColor,
            }}
          >
            {statusText}
          </Text>
        </View>
      </View>

      {/* Details Grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <DetailItem label="Glucose" value={test.glucose} unit="mg/dL" />
        <DetailItem
          label="Blood Pressure"
          value={test.bloodPressure}
          unit="mm Hg"
        />
        <DetailItem label="BMI" value={test.bmi} unit="kg/m²" />
        <DetailItem label="Insulin" value={test.insulin} unit="μU/mL" />
        <DetailItem
          label="Skin Thickness"
          value={test.skinThickness}
          unit="mm"
        />
        <DetailItem label="Pregnancies" value={test.pregnancies} />
        <DetailItem
          label="Diabetes Pedigree"
          value={test.diabetesPedigreeFunction}
        />
        <DetailItem label="Age" value={test.age} />
      </View>
    </TouchableOpacity>
  );
};

export default TestCard;
