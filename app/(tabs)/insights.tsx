import { useUser } from "@/context/UserContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

// Result Ratio Chart Component (Bar/Pie switcher)
interface ResultRatioChartProps {
  yesCount: number;
  noCount: number;
  isDark: boolean;
}

const ResultRatioChart: React.FC<ResultRatioChartProps> = ({
  yesCount,
  noCount,
  isDark,
}) => {
  const [chartType, setChartType] = useState<"Bar" | "Pie">("Bar");
  const total = yesCount + noCount;

  if (total === 0) return null;

  const barData = [
    {
      value: noCount,
      label: "No",
      frontColor: "#34C759",
      gradientColor: "#34C759",
      topLabelComponent: () => (
        <Text
          style={{
            color: isDark ? "#FFF" : "#000",
            fontSize: 12,
            fontFamily: "FunnelDisplay-SemiBold",
            marginBottom: 4,
          }}
        >
          {noCount}
        </Text>
      ),
    },
    {
      value: yesCount,
      label: "Yes",
      frontColor: "#EF4444",
      gradientColor: "#EF4444",
      topLabelComponent: () => (
        <Text
          style={{
            color: isDark ? "#FFF" : "#000",
            fontSize: 12,
            fontFamily: "FunnelDisplay-SemiBold",
            marginBottom: 4,
          }}
        >
          {yesCount}
        </Text>
      ),
    },
  ];

  const pieData = [
    {
      value: noCount,
      color: "#34C759",
      text: `${Math.round((noCount / total) * 100)}%`,
      textColor: "#FFF",
      focused: noCount >= yesCount,
    },
    {
      value: yesCount,
      color: "#EF4444",
      text: `${Math.round((yesCount / total) * 100)}%`,
      textColor: "#FFF",
      focused: yesCount > noCount,
    },
  ];

  const chartConfig = {
    rulesColor: isDark ? "#333" : "#EEE",
    xAxisColor: isDark ? "#555" : "#CCC",
    yAxisColor: isDark ? "#555" : "#CCC",
    yAxisTextStyle: { color: isDark ? "#AAA" : "#666", fontSize: 10 },
    xAxisLabelTextStyle: { color: isDark ? "#AAA" : "#666", fontSize: 10 },
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
          Test Results Ratio
        </Text>
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 24,
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#34C759",
            }}
          />
          <Text
            style={{
              fontFamily: "FunnelDisplay-Regular",
              color: isDark ? "#AAA" : "#666",
              fontSize: 13,
            }}
          >
            No Diabetes ({noCount})
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#EF4444",
            }}
          />
          <Text
            style={{
              fontFamily: "FunnelDisplay-Regular",
              color: isDark ? "#AAA" : "#666",
              fontSize: 13,
            }}
          >
            Diabetes ({yesCount})
          </Text>
        </View>
      </View>

      <View style={{ alignItems: "center", overflow: "hidden" }}>
        {chartType === "Bar" ? (
          <BarChart
            data={barData}
            height={200}
            width={width - 120}
            barWidth={50}
            spacing={40}
            initialSpacing={40}
            showGradient
            isAnimated
            roundedTop
            roundedBottom={false}
            noOfSections={5}
            yAxisTextStyle={chartConfig.yAxisTextStyle}
            xAxisLabelTextStyle={chartConfig.xAxisLabelTextStyle}
            rulesColor={chartConfig.rulesColor}
            xAxisColor={chartConfig.xAxisColor}
            yAxisColor={chartConfig.yAxisColor}
          />
        ) : (
          <PieChart
            data={pieData}
            donut
            // showText
            // textColor="#FFF"
            radius={100}
            innerRadius={50}
            innerCircleColor={isDark ? "#1C1C1E" : "#FFF"}
            // textSize={14}
            focusOnPress
            showValuesAsLabels
            textBackgroundRadius={22}
            isAnimated
          />
        )}
      </View>

      {/* Switcher */}
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
          onPress={() => setChartType("Bar")}
          style={{
            flex: 1,
            paddingVertical: 8,
            alignItems: "center",
            borderRadius: 14,
            backgroundColor:
              chartType === "Bar" ? "rgba(52, 199, 89, 0.15)" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "FunnelDisplay-SemiBold",
              color:
                chartType === "Bar"
                  ? "#34C759"
                  : isDark
                  ? "#8E8E93"
                  : "#8E8E93",
            }}
          >
            Bar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setChartType("Pie")}
          style={{
            flex: 1,
            paddingVertical: 8,
            alignItems: "center",
            borderRadius: 14,
            backgroundColor:
              chartType === "Pie" ? "rgba(52, 199, 89, 0.15)" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "FunnelDisplay-SemiBold",
              color:
                chartType === "Pie"
                  ? "#34C759"
                  : isDark
                  ? "#8E8E93"
                  : "#8E8E93",
            }}
          >
            Pie
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Tests Per Day Chart Component (Line/Bar switcher)
interface TestsPerDayChartProps {
  data: { value: number; label: string; dataPointText?: string }[];
  isDark: boolean;
}

const TestsPerDayChart: React.FC<TestsPerDayChartProps> = ({
  data,
  isDark,
}) => {
  const [chartType, setChartType] = useState<"Line" | "Bar">("Line");

  if (data.length === 0) return null;

  const chartConfig = {
    color: "#007AFF",
    rulesColor: isDark ? "#333" : "#EEE",
    xAxisColor: isDark ? "#555" : "#CCC",
    yAxisColor: isDark ? "#555" : "#CCC",
    yAxisTextStyle: { color: isDark ? "#AAA" : "#666", fontSize: 10 },
    xAxisLabelTextStyle: { color: isDark ? "#AAA" : "#666", fontSize: 10 },
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
          Tests Per Day{" "}
          <Text
            style={{
              fontSize: 14,
              fontFamily: "FunnelDisplay-Regular",
              color: isDark ? "#8E8E93" : "#8E8E93",
            }}
          >
            (Last 7 Days)
          </Text>
        </Text>
      </View>

      <View style={{ alignItems: "center", overflow: "hidden" }}>
        {chartType === "Line" ? (
          <LineChart
            data={data}
            height={200}
            width={width - 80}
            initialSpacing={20}
            color={chartConfig.color}
            thickness={3}
            dataPointsColor={chartConfig.color}
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
            data={data.map((d) => ({
              ...d,
              frontColor: chartConfig.color,
              gradientColor: chartConfig.color,
              topLabelComponent: () => (
                <Text
                  style={{
                    color: chartConfig.textColor,
                    fontSize: 11,
                    fontFamily: "FunnelDisplay-SemiBold",
                    marginBottom: 4,
                  }}
                >
                  {d.value}
                </Text>
              ),
            }))}
            height={200}
            width={width - 80}
            barWidth={24}
            spacing={24}
            initialSpacing={20}
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

      {/* Switcher */}
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
              chartType === "Line" ? "rgba(0, 122, 255, 0.15)" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "FunnelDisplay-SemiBold",
              color:
                chartType === "Line"
                  ? "#007AFF"
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
              chartType === "Bar" ? "rgba(0, 122, 255, 0.15)" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "FunnelDisplay-SemiBold",
              color:
                chartType === "Bar"
                  ? "#007AFF"
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

export default function InsightsTabScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userData } = useUser();

  // Process all test data from all patients
  const { resultRatioData, testsPerDayData, hasData } = useMemo(() => {
    if (!userData?.patients) {
      return {
        resultRatioData: { yes: 0, no: 0 },
        testsPerDayData: [],
        hasData: false,
      };
    }

    // Flatten all tests from all patients
    const allTests = userData.patients.flatMap((p) => p.tests || []);

    if (allTests.length === 0) {
      return {
        resultRatioData: { yes: 0, no: 0 },
        testsPerDayData: [],
        hasData: false,
      };
    }

    // Calculate result ratio
    const yesCount = allTests.filter((t) => t.result === 1).length;
    const noCount = allTests.filter((t) => t.result === 0).length;

    // Get tests from last 7 days
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Create map for last 7 days
    const dateMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = `${date.getMonth() + 1}/${date.getDate()}`;
      dateMap[key] = 0;
    }

    // Count tests per day
    allTests.forEach((test) => {
      const testDate = new Date(test.testDate);
      if (testDate >= sevenDaysAgo) {
        const key = `${testDate.getMonth() + 1}/${testDate.getDate()}`;
        if (dateMap.hasOwnProperty(key)) {
          dateMap[key]++;
        }
      }
    });

    // Convert to chart data format
    const testsPerDay = Object.entries(dateMap).map(([label, value]) => ({
      value,
      label,
      dataPointText: value.toString(),
    }));

    return {
      resultRatioData: { yes: yesCount, no: noCount },
      testsPerDayData: testsPerDay,
      hasData: true,
    };
  }, [userData]);

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
          Insights
        </Text>
      </View>

      {hasData ? (
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <ResultRatioChart
            yesCount={resultRatioData.yes}
            noCount={resultRatioData.no}
            isDark={isDark}
          />
          <TestsPerDayChart data={testsPerDayData} isDark={isDark} />
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "FunnelDisplay-Regular",
              color: isDark ? "#8E8E93" : "#8E8E93",
            }}
          >
            No test data available yet
          </Text>
        </View>
      )}
    </View>
  );
}
