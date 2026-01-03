import { useUser } from "@/context/UserContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

// Reusable Chart Component
interface InsightChartProps {
  label: string;
  data: { value: number; label?: string; dataPointText?: string }[];
  color: string;
  isDark: boolean;
  unit: string;
}

const InsightChart: React.FC<InsightChartProps> = ({
  label,
  data,
  color,
  isDark,
  unit,
}) => {
  const [chartType, setChartType] = useState<"Line" | "Bar">("Line");

  if (data.length === 0) return null;

  const chartConfig = {
    color,
    thickness: 3,
    startFillColor: color,
    endFillColor: color,
    startOpacity: 0.3,
    endOpacity: 0.0,
    backgroundColor: "transparent",
    rulesColor: isDark ? "#333" : "#EEE",
    xAxisColor: isDark ? "#555" : "#CCC",
    yAxisColor: isDark ? "#555" : "#CCC",
    yAxisTextStyle: { color: isDark ? "#AAA" : "#666", fontSize: 10 },
    xAxisLabelTextStyle: { color: isDark ? "#AAA" : "#666", fontSize: 10 },
    dataPointsColor: color,
    textColor: isDark ? "#FFF" : "#000",
  };

  return (
    <View
      style={{
        backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: isDark ? "#2C2C2E" : "#F2F2F7",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "FunnelDisplay-SemiBold",
            color: isDark ? "#E0E0E0" : "#1C1C1E",
          }}
        >
          {label}{" "}
          <Text
            style={{
              fontSize: 14,
              fontFamily: "FunnelDisplay-Regular",
              color: isDark ? "#8E8E93" : "#8E8E93",
            }}
          >
            ({unit})
          </Text>
        </Text>
      </View>

      <View style={{ alignItems: "center", overflow: "hidden" }}>
        {chartType === "Line" ? (
          <LineChart
            data={data}
            height={200}
            width={width - 80} // Adjust for padding
            initialSpacing={20}
            color={color}
            thickness={3}
            dataPointsColor={color}
            dataPointsRadius={4}
            textShiftY={-8}
            textShiftX={-4}
            textFontSize={11}
            textColor={chartConfig.textColor}
            yAxisTextStyle={chartConfig.yAxisTextStyle}
            xAxisLabelTextStyle={chartConfig.xAxisLabelTextStyle}
            rulesColor={chartConfig.rulesColor}
            xAxisColor={chartConfig.xAxisColor}
            yAxisColor={chartConfig.yAxisColor}
            hideRules={false}
            curved
            isAnimated
          />
        ) : (
          <BarChart
            data={data}
            height={200}
            width={width - 80}
            barWidth={24}
            spacing={24}
            initialSpacing={20}
            frontColor={color}
            gradientColor={color}
            showGradient
            isAnimated
            roundedTop
            roundedBottom={false}
            yAxisTextStyle={chartConfig.yAxisTextStyle}
            xAxisLabelTextStyle={chartConfig.xAxisLabelTextStyle}
            rulesColor={chartConfig.rulesColor}
            xAxisColor={chartConfig.xAxisColor}
            yAxisColor={chartConfig.yAxisColor}
          />
        )}
      </View>

      {/* Switcher Logic */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7",
          borderRadius: 14,
          padding: 4,
          marginTop: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => setChartType("Line")}
          style={{
            flex: 1,
            paddingVertical: 8,
            alignItems: "center",
            borderRadius: 14,
            backgroundColor:
              chartType === "Line" ? "rgba(239, 68, 68, 0.15)" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "FunnelDisplay-SemiBold",
              color:
                chartType === "Line"
                  ? "#EF4444"
                  : isDark
                  ? "#8E8E93"
                  : "#8E8E93",
            }}
          >
            Line
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setChartType("Bar")}
          style={{
            flex: 1,
            paddingVertical: 8,
            alignItems: "center",
            borderRadius: 14,
            backgroundColor:
              chartType === "Bar" ? "rgba(239, 68, 68, 0.15)" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "FunnelDisplay-SemiBold",
              color:
                chartType === "Bar"
                  ? "#EF4444"
                  : isDark
                  ? "#8E8E93"
                  : "#8E8E93",
            }}
          >
            Bar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function InsightScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userData } = useUser();

  const patient = userData?.patients.find((p) => p.pid === id);

  // Process data: Get last 6 tests, sort by date ascending
  const processedData = useMemo(() => {
    if (!patient?.tests) return {};

    const sortedTests = [...patient.tests]
      .sort(
        (a, b) =>
          new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
      )
      .slice(-6); // Take last 6

    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    };

    return {
      glucose: sortedTests.map((t) => ({
        value: t.glucose,
        label: formatDate(t.testDate),
        dataPointText: t.glucose.toString(),
      })),
      bloodPressure: sortedTests.map((t) => ({
        value: t.bloodPressure,
        label: formatDate(t.testDate),
        dataPointText: t.bloodPressure.toString(),
      })),
      bmi: sortedTests.map((t) => ({
        value: t.bmi,
        label: formatDate(t.testDate),
        dataPointText: t.bmi.toString(),
      })),
      insulin: sortedTests.map((t) => ({
        value: t.insulin,
        label: formatDate(t.testDate),
        dataPointText: t.insulin.toString(),
      })),
    };
  }, [patient]);

  if (!patient) return null;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000000" : "#F2F2F7" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "ios" ? 60 : 16,
          paddingBottom: 12,
          backgroundColor: isDark ? "#000000" : "#F2F2F7",
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
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
          <MaterialIcons
            name="keyboard-arrow-left"
            size={32}
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
            marginRight: 38,
            letterSpacing: -0.5,
          }}
        >
          Health Insights
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {processedData.glucose && (
          <InsightChart
            label="Glucose Level"
            data={processedData.glucose}
            color="#EF4444"
            isDark={isDark}
            unit="mg/dL"
          />
        )}
        {processedData.bloodPressure && (
          <InsightChart
            label="Blood Pressure"
            data={processedData.bloodPressure}
            color="#007AFF"
            isDark={isDark}
            unit="mm Hg"
          />
        )}
        {processedData.bmi && (
          <InsightChart
            label="BMI"
            data={processedData.bmi}
            color="#FF9500"
            isDark={isDark}
            unit="kg/m²"
          />
        )}
        {processedData.insulin && (
          <InsightChart
            label="Insulin Level"
            data={processedData.insulin}
            color="#AF52DE"
            isDark={isDark}
            unit="μU/mL"
          />
        )}
      </ScrollView>
    </View>
  );
}
