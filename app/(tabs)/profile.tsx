import { useUser } from "@/context/UserContext";
import { UserService } from "@/firebase/userService";
import { callGemini } from "@/gemini/geminiService";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileTabScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { userData, setUserData } = useUser();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [focusedField, setFocusedField] = React.useState<
    "name" | "email" | null
  >(null); // <-- separate focus
  // Removed local user state
  const [avatarColor, setAvatarColor] = React.useState("#000");
  const [initials, setInitials] = React.useState("");
  const [buttonText, setButtonText] = React.useState("");

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

  useEffect(() => {
    if (userData?.name || userData?.email) setButtonText("edit profile");
    else setButtonText("Add profile");
  }, [userData]);

  useEffect(() => {
    if (userData?.name) {
      setName(userData.name);
      setAvatarColor(getAvatarColor(userData.name));
      setInitials(
        userData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      );
    }
    if (userData?.email) setEmail(userData.email);
  }, [userData]);

  const handleUpdateProfile = async () => {
    if (userData?.name === name && userData?.email === email) {
      alert("No changes made");
      return;
    }
    try {
      if (userData) {
        await UserService.updateUserFields(userData.uid, { name, email });
        // Update context immediately
        setUserData({ ...userData, name, email });
        setButtonText("edit profile");
        alert("Profile updated successfully");
      }
    } catch (e) {
      console.log(e);
      alert("Failed to update profile");
    }
  };

  const handleProceed = () => {
    if (buttonText === "Add profile" || buttonText === "edit profile") {
      setButtonText("Update profile");
    } else {
      setButtonText("Saving...");
      handleUpdateProfile();
    }
  };

  // Testing Gemini

  const handleGenerate = async () => {
    console.log("Generating...");
    const response = await callGemini("Say Hello only");
    console.log(response);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: isDark ? "#000" : "#F2F2F7" }}
        contentContainerStyle={{ paddingBottom: 40 }} // extra space for keyboard
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View
          style={{ marginTop: 20, paddingHorizontal: 16, paddingBottom: 10 }}
        >
          <Text
            style={{
              fontSize: 34,
              fontFamily: "FunnelDisplay-Bold",
              color: isDark ? "#E0E0E0" : "#000",
            }}
          >
            Profile
          </Text>
        </View>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {userData?.name ? (
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: avatarColor,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 25,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 5,
                marginTop: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 55,
                  fontFamily: "FunnelDisplay-Bold",
                  color: "#FFF",
                }}
              >
                {initials}
              </Text>
            </View>
          ) : (
            <Image
              source={require("@/assets/images/preview1.png")}
              style={{ width: 300, height: 300 }}
              resizeMode="contain"
            />
          )}

          <View
            style={{
              backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
              borderRadius: 20,
              padding: 16,
              margin: 12,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? "#2C2C2E" : "#F2F2F7",
            }}
          >
            {/* Personal Info Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: 8,
                marginBottom: 18,
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#2C2C2E" : "#F2F2F7",
              }}
            >
              <Text
                style={{
                  fontFamily: "FunnelDisplay-Bold",
                  fontSize: 24,
                  color: isDark ? "#E0E0E0" : "#000",
                }}
              >
                Personal Information
              </Text>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderColor: isDark ? "#E0E0E0" : "#000",
                  borderWidth: 1,
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={isDark ? "#E0E0E0" : "#000"}
                />
              </View>
            </View>

            {/* Name Field */}
            <View>
              <Text
                style={{
                  fontFamily: "FunnelDisplay-Regular",
                  fontSize: 18,
                  color: isDark ? "#E0E0E0" : "#000",
                  marginBottom: 6,
                }}
              >
                Name
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor:
                    focusedField === "name"
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
                    minHeight: 20,
                  }}
                  value={name}
                  onChangeText={setName}
                  placeholder="Name"
                  editable={
                    buttonText !== "Add profile" &&
                    buttonText !== "edit profile" &&
                    buttonText !== "Saving..."
                  }
                  placeholderTextColor={isDark ? "#636366" : "#C7C7CC"}
                  keyboardType="default"
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Email Field */}
            <View>
              <Text
                style={{
                  fontFamily: "FunnelDisplay-Regular",
                  fontSize: 18,
                  color: isDark ? "#E0E0E0" : "#000",
                  marginBottom: 6,
                  marginTop: 12,
                }}
              >
                Email
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor:
                    focusedField === "email"
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
                    minHeight: 20,
                  }}
                  value={email}
                  onChangeText={setEmail}
                  editable={
                    buttonText !== "Add profile" &&
                    buttonText !== "edit profile" &&
                    buttonText !== "Saving..."
                  }
                  placeholder="Email"
                  placeholderTextColor={isDark ? "#636366" : "#C7C7CC"}
                  keyboardType="email-address"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              <TouchableOpacity
                onPress={handleProceed}
                style={{
                  backgroundColor: isDark ? "#D32F2F" : "#EF4444",
                  padding: 16,
                  borderRadius: 18,
                  alignItems: "center",
                  marginTop: 30,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontFamily: "FunnelDisplay-Bold",
                    letterSpacing: -0.2,
                  }}
                >
                  {buttonText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
