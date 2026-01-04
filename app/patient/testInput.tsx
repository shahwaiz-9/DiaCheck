import { submitDiabetesPrediction } from "@/api/backend";
import { constructPrompt } from "@/constants/prompt";
import { useUser } from "@/context/UserContext";
import { callGeminiAndParse } from "@/gemini/geminiService";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { validateForm } from "@/utlis/safeValues";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// MARK: - Props

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "numeric" | "decimal-pad" | "default";
  isDark: boolean;
}

// MARK: - Components

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "numeric",
  isDark,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: 20 }}>
      {/* Label */}
      <Text
        style={{
          fontSize: 15,
          fontFamily: "FunnelDisplay-Medium",
          color: isDark ? "#E5E5E7" : "#1C1C1E",
          marginBottom: 8,
          letterSpacing: -0.2,
        }}
      >
        {label}
      </Text>
      {/* Input Container */}
      <View
        style={{
          borderWidth: 1.5,
          borderColor: isFocused
            ? isDark
              ? "#D32F2F"
              : "#EF4444"
            : isDark
            ? "#3A3A3C"
            : "#E5E5EA",
          borderRadius: 12,
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <TextInput
          style={{
            fontSize: 16,
            fontFamily: "FunnelDisplay-Regular",
            color: isDark ? "#FFFFFF" : "#1C1C1E",
            minHeight: 24,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#636366" : "#C7C7CC"}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

export default function TestInputScreen() {
  // MARK: - Hooks
  const { id, age } = useLocalSearchParams<{ id: string; age: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // MARK: - Form State

  const [pregnancies, setPregnancies] = useState("");
  const [glucose, setGlucose] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [skinThickness, setSkinThickness] = useState("");
  const [insulin, setInsulin] = useState("");
  const [bmi, setBmi] = useState("");
  const [diabetesPedigreeFunction, setDiabetesPedigreeFunction] = useState("");
  const [loadingText, setLoadingText] = useState("");

  const { addTest } = useUser();
  const [loading, setLoading] = useState(false);

  // MARK: - Functions

  const uploadToFirebase = async (
    result: number,
    currentState: string,
    recommendation: string
  ) => {
    try {
      await addTest(id, {
        pregnancies: Number(pregnancies),
        glucose: Number(glucose),
        bloodPressure: Number(bloodPressure),
        skinThickness: Number(skinThickness),
        insulin: Number(insulin),
        bmi: Number(bmi),
        diabetesPedigreeFunction: Number(diabetesPedigreeFunction),
        result: result === 0 || result === 1 ? result : 0,
        age: Number(age),
        currentState: currentState,
        recommendation: recommendation,
      });
      router.back();
    } catch (error) {
      console.error("Failed to add test:", error);
      throw error; // Re-throw to handle in caller
    } finally {
      // setLoading(false); // Handled in caller
    }
  };

  const handleFormValidation = (formValues: any) => {
    const errors = validateForm(formValues);

    if (Object.keys(errors).length > 0) {
      // Show the user which fields are invalid
      console.log("Validation errors:", errors);
      alert(
        "Please fix the following fields:\n" +
          Object.entries(errors)
            .map(([key, msg]) => `${key}: ${msg}`)
            .join("\n")
      );
      return false;
    }
    return true;
  };

  const handleProceed = async () => {
    console.log("Proceeding...");
    if (!id || typeof id !== "string") return;

    const formValues = {
      pregnancies,
      glucose,
      bloodPressure,
      skinThickness,
      insulin,
      bmi,
      diabetesPedigreeFunction,
      age: age || "",
      outcome: 0,
    };
    console.log(formValues);

    // Form validation
    const validationPayload = {
      pregnancies,
      glucose,
      bloodPressure,
      skinThickness,
      insulin,
      bmi,
      diabetesPedigreeFunction,
      age: age || "",
    };

    const isValid = handleFormValidation(validationPayload);
    if (!isValid) return;

    setLoading(true);

    try {
      setLoadingText("Predicting Results...");
      const prediction = await submitDiabetesPrediction(formValues);
      console.log("Prediction:", prediction);

      formValues.outcome = prediction.prediction;

      // Gemini reponse coming soon

      const aiPrompt = constructPrompt(formValues);
      console.log(aiPrompt);
      setLoadingText("Getting AI Analysis...");
      const aiResponse = await callGeminiAndParse(aiPrompt);
      console.log("AI Analysis:", aiResponse);

      if (!aiResponse?.CurrentState || !aiResponse?.Recomendation) {
        alert("AI Analysis failed");
        return;
      }

      setLoadingText("Saving Results...");

      // Firebase upload
      await uploadToFirebase(
        prediction.prediction,
        aiResponse.CurrentState,
        aiResponse.Recomendation
      );

      router.push({
        pathname: "/patient/result",
        params: {
          id,
          result: prediction.prediction,
          currentState: aiResponse.CurrentState,
          recommendation: aiResponse.Recomendation,
          pregnancies,
          glucose,
          bloodPressure,
          skinThickness,
          insulin,
          bmi,
          diabetesPedigreeFunction,
          age,
        },
      });
    } catch (error) {
      console.error("Failed to save results:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    glucose.trim() !== "" && bloodPressure.trim() !== "" && bmi.trim() !== "";

  // MARK: - EMPTY UI

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDark ? "#000000" : "#F2F2F7",
        }}
      >
        <LottieView
          source={require("../../assets/loading.json")}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
        <Text
          style={{
            marginTop: 10,
            fontSize: 18,
            fontFamily: "FunnelDisplay-Medium",
            color: isDark ? "#FFFFFF" : "#1C1C1E",
          }}
        >
          {loadingText}
        </Text>
      </View>
    );
  }

  // MARK: - MAIN UI

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000000" : "#F2F2F7" }}>
      {/* Custom Header */}
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
          Medical Details
        </Text>
      </View>

      {/* Form Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 120,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Section Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View
              style={{
                width: 4,
                height: 20,
                borderRadius: 2,
                backgroundColor: isDark ? "#D32F2F" : "#EF4444",
                marginRight: 12,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "FunnelDisplay-Bold",
                color: isDark ? "#FFFFFF" : "#1C1C1E",
                letterSpacing: -0.4,
              }}
            >
              Patient Metrics
            </Text>
          </View>

          <InputField
            label="Pregnancies"
            value={pregnancies}
            onChangeText={setPregnancies}
            placeholder="Enter count"
            isDark={isDark}
          />

          <InputField
            label="Glucose Level"
            value={glucose}
            onChangeText={setGlucose}
            placeholder="mg/dL"
            isDark={isDark}
          />

          <InputField
            label="Blood Pressure"
            value={bloodPressure}
            onChangeText={setBloodPressure}
            placeholder="mm Hg"
            isDark={isDark}
          />

          <InputField
            label="Skin Thickness"
            value={skinThickness}
            onChangeText={setSkinThickness}
            placeholder="mm"
            isDark={isDark}
          />

          <InputField
            label="Insulin Level"
            value={insulin}
            onChangeText={setInsulin}
            placeholder="μU/mL"
            isDark={isDark}
          />

          <InputField
            label="Body Mass Index (BMI)"
            value={bmi}
            onChangeText={setBmi}
            placeholder="kg/m²"
            keyboardType="decimal-pad"
            isDark={isDark}
          />

          <InputField
            label="Diabetes Pedigree Function"
            value={diabetesPedigreeFunction}
            onChangeText={setDiabetesPedigreeFunction}
            placeholder="0.0 - 2.5"
            keyboardType="decimal-pad"
            isDark={isDark}
          />
        </ScrollView>

        {/* Continue Button */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingVertical: 16,
            paddingBottom: Platform.OS === "ios" ? 32 : 26,
            // backgroundColor: isDark ? "#000000" : "#F2F2F7",
            // borderTopWidth: 1,
            // borderTopColor: isDark ? "#1C1C1E" : "#E5E5EA",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: isDark ? "#D32F2F" : "#EF4444",

              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              shadowColor: isFormValid
                ? isDark
                  ? "#D32F2F"
                  : "#EF4444"
                : "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isFormValid ? 0.3 : 0.05,
              shadowRadius: 8,
              elevation: isFormValid ? 4 : 1,
            }}
            onPress={handleProceed}
            disabled={!isFormValid || loading}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 17,
                fontFamily: "FunnelDisplay-Bold",
                letterSpacing: -0.3,
              }}
            >
              {loading ? "Saving..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
