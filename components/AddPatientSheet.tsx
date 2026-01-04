import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AddPatientSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddPatient: (patient: { name: string; age: string; phone: string }) => void;
  loading?: boolean;
}

const AddPatientSheet: React.FC<AddPatientSheetProps> = ({
  visible,
  onClose,
  onAddPatient,
  loading = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");

  // Reset form when opening
  useEffect(() => {
    if (visible) {
      setName("");
      setAge("");
      setPhone("");
    }
  }, [visible]);

  const handleSave = () => {
    if (!name || !age) {
      alert("Please fill in all fields");
      return;
    }
    if (Number(age) < 10 || Number(age) > 100) {
      alert("Age must be between 10 and 100");
      return;
    }
    if (phone.length !== 11 || !phone.startsWith("03")) {
      alert("Phone number must be 11 digits and start with 03");
      return;
    }

    onAddPatient({ name, age, phone });
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Backdrop */}
      <Animated.View
        entering={FadeIn.duration(500)} // Slow fade in
        exiting={FadeOut.duration(500)} // Slow fade out
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={!loading ? onClose : undefined}
        />
      </Animated.View>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          zIndex: 1,
        }}
      >
        <Animated.View
          entering={SlideInDown.springify().damping(20).mass(1).stiffness(100)} // Smooth spring
          exiting={SlideOutDown.duration(500)} // Slow slide out
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: SCREEN_HEIGHT * 0.9,
            // Shadow for sheet
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 10,
            backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
            overflow: "hidden", // Ensure content respects border radius
          }}
        >
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center", // Centered
                    alignItems: "center",
                    marginBottom: 24,
                    position: "relative", // For absolute close button
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "FunnelDisplay-Bold",
                      color: isDark ? "#E0E0E0" : "#000",
                      textAlign: "center",
                    }}
                  >
                    Add Patient
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    disabled={loading}
                    style={{
                      padding: 4,
                      position: "absolute",
                      right: 0,
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={isDark ? "#8E8E93" : "#8E8E93"}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ gap: 16 }}>
                  <View style={{ gap: 8 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "FunnelDisplay-Medium",
                        textTransform: "uppercase",
                        color: isDark ? "#AEAEB2" : "#8E8E93",
                      }}
                    >
                      Name
                    </Text>
                    <TextInput
                      style={{
                        fontSize: 15,
                        paddingVertical: 18,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        color: isDark ? "#E0E0E0" : "#000",
                        borderColor: isDark ? "#38383A" : "#E5E5EA",
                        opacity: loading ? 0.5 : 1,
                        fontFamily: "FunnelDisplay-Regular",
                      }}
                      placeholder="John Doe"
                      placeholderTextColor={isDark ? "#545456" : "#C7C7CC"}
                      value={name}
                      onChangeText={setName}
                      editable={!loading}
                    />
                  </View>

                  <View style={{ gap: 8 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "FunnelDisplay-Medium",
                        textTransform: "uppercase",
                        color: isDark ? "#AEAEB2" : "#8E8E93",
                      }}
                    >
                      Age
                    </Text>
                    <TextInput
                      style={{
                        fontSize: 15,
                        paddingVertical: 18,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        color: isDark ? "#FFF" : "#000",
                        borderColor: isDark ? "#38383A" : "#E5E5EA",
                        opacity: loading ? 0.5 : 1,
                        fontFamily: "FunnelDisplay-Regular",
                      }}
                      placeholder="30"
                      placeholderTextColor={isDark ? "#545456" : "#C7C7CC"}
                      value={age}
                      onChangeText={setAge}
                      keyboardType="number-pad"
                      editable={!loading}
                    />
                  </View>

                  <View style={{ gap: 8 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "FunnelDisplay-Medium",
                        textTransform: "uppercase",
                        color: isDark ? "#AEAEB2" : "#8E8E93",
                      }}
                    >
                      Phone (Optional)
                    </Text>
                    <TextInput
                      style={{
                        fontSize: 15,
                        paddingVertical: 18,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        color: isDark ? "#FFF" : "#000",
                        borderColor: isDark ? "#38383A" : "#E5E5EA",
                        opacity: loading ? 0.5 : 1,
                        fontFamily: "FunnelDisplay-Regular",
                      }}
                      placeholder="xxxx-xxxxxxx"
                      placeholderTextColor={isDark ? "#545456" : "#C7C7CC"}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      editable={!loading}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#D32F2F",
                      borderRadius: 30,
                      paddingVertical: 16,
                      alignItems: "center",
                      marginTop: 16,
                      opacity: name && age && !loading ? 1 : 0.6,
                    }}
                    onPress={handleSave}
                    disabled={!name || !age || loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text
                        style={{
                          color: "#FFF",
                          fontSize: 17,
                          fontFamily: "FunnelDisplay-Bold",
                        }}
                      >
                        Save
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddPatientSheet;
