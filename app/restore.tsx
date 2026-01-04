import { useUser } from "@/context/UserContext";
import { UserService } from "@/firebase/userService";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RestoreScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { userData, refreshData } = useUser();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const animationRef = useRef<LottieView>(null);

  const handleRestore = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    setLoading(true);

    try {
      const foundUid = await UserService.getUserByEmail(email);

      if (!foundUid) {
        Alert.alert("Error", "No account found with this email.");
        setLoading(false);
        return;
      }

      if (foundUid === userData?.uid) {
        Alert.alert("Info", "You are already using this account.");
        setLoading(false);
        return;
      }

      const hasData = userData && userData.patients.length > 0;

      if (hasData) {
        Alert.alert(
          "Data Found",
          "We found existing data on your current temporary profile. Do you want to merge it with the restored account?",
          [
            {
              text: "No, Overwrite",
              style: "destructive",
              onPress: () => performSwitch(foundUid),
            },
            {
              text: "Yes, Merge",
              onPress: () => performMerge(userData.uid, foundUid),
            },
          ]
        );
      } else {
        await performSwitch(foundUid);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to restore data.");
      setLoading(false);
    }
  };

  const performSwitch = async (targetUid: string) => {
    try {
      const AsyncStorage =
        require("@react-native-async-storage/async-storage").default;
      await AsyncStorage.setItem("user_id", targetUid);
      Alert.alert("Success", "Account restored successfully!", [
        {
          text: "OK",
          onPress: () => {
            refreshData();
            router.replace("/(tabs)/profile");
          },
        },
      ]);
    } catch (e) {
      Alert.alert("Error", "Could not switch user.");
    } finally {
      setLoading(false);
    }
  };

  const performMerge = async (currentUid: string, targetUid: string) => {
    try {
      await UserService.mergeAndSwitchUser(currentUid, targetUid);
      Alert.alert("Success", "Data merged and account restored!", [
        {
          text: "OK",
          onPress: () => {
            refreshData();
            router.replace("/(tabs)/profile");
          },
        },
      ]);
    } catch (e) {
      Alert.alert("Error", "Merge failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#000" : "#F2F2F7" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: Platform.OS === "ios" ? 60 : 16,
            paddingBottom: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isDark ? "#2A2A2A" : "#FFF",
              justifyContent: "center",
              alignItems: "center",
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
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
              fontSize: 22,
              fontFamily: "FunnelDisplay-Bold",
              textAlign: "center",
              color: isDark ? "#FFF" : "#000",
              marginRight: 40,
            }}
          >
            Restore Data
          </Text>
        </View>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <LottieView
              autoPlay
              ref={animationRef}
              style={{ width: 150, height: 150 }}
              source={require("../assets/loading.json")}
            />
            <Text
              style={{
                color: isDark ? "#AAA" : "#666",
                fontFamily: "FunnelDisplay-Bold",
              }}
            >
              Restoring your data...
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              flexGrow: 1,
              //   justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: isDark ? "#1C1C1E" : "#FFF",
                borderRadius: 24,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.3 : 0.08,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={32}
                    color={isDark ? "#E0E0E0" : "#000"}
                  />
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    lineHeight: 22,
                    color: isDark ? "#E0E0E0" : "#444",
                    fontFamily: "FunnelDisplay-Regular",
                  }}
                >
                  Enter the email address associated with your previous account
                  to restore your data.
                </Text>
              </View>

              <Text
                style={{
                  marginBottom: 8,
                  fontFamily: "FunnelDisplay-SemiBold",
                  color: isDark ? "#E0E0E0" : "#000",
                }}
              >
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                placeholderTextColor={isDark ? "#666" : "#AAA"}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                  backgroundColor: isDark ? "#2C2C2E" : "#F9F9F9",
                  borderRadius: 12,
                  padding: 16,
                  color: isDark ? "#FFF" : "#000",
                  fontFamily: "FunnelDisplay-Regular",
                  borderWidth: 1,
                  borderColor: isDark ? "#3A3A3C" : "#E5E5EA",
                  marginBottom: 24,
                }}
              />

              <TouchableOpacity
                onPress={handleRestore}
                activeOpacity={0.8}
                style={{
                  backgroundColor: isDark ? "#D32F2F" : "#EF4444",
                  borderRadius: 16,
                  paddingVertical: 18,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 18,
                    fontFamily: "FunnelDisplay-Bold",
                  }}
                >
                  Restore Data
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
