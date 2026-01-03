// import { MaterialIcons } from '@expo/vector-icons';
// import React from 'react';
// import { Pressable, Text, useColorScheme, View } from 'react-native';
// // Define the Patient type for reuse
// export interface Patient {
//     id: string;
//     name: string;
//     age: string;
//     phone: string;
//     color: string; // Avatar background color
// }

// interface PatientCardProps {
//     patient: Patient;
//     onPress?: () => void;
// }

// const PatientCard: React.FC<PatientCardProps> = ({ patient, onPress }) => {
//     const colorScheme = useColorScheme();
//     const isDark = colorScheme === 'dark';

//     const getInitials = (name: string) => {
//         const names = name.split(' ');
//         let initials = names[0].substring(0, 1).toUpperCase();
//         if (names.length > 1) {
//             initials += names[names.length - 1].substring(0, 1).toUpperCase();
//         }
//         return initials;
//     };

//     return (
//         <Pressable
//             style={({ pressed }) => ({
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 paddingVertical: 16, // Increased padding
//                 paddingHorizontal: 20, // Increased padding
//                 marginHorizontal: 16,
//                 marginBottom: 12,
//                 borderRadius: 12,
//                 // iOS Shadow
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 2,
//                 // Android Elevation
//                 elevation: 2,
//                 backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
//                 opacity: pressed ? 0.7 : 1,
//                 borderWidth: 0.3, // Border lining
//                 borderColor: '#D32F2F', // Red border on both themes
//             })}
//             onPress={onPress}
//         >
//             <View style={{
//                 width: 60,
//                 height: 60,
//                 borderRadius: 30,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginRight: 16,
//                 backgroundColor: patient.color
//             }}>
//                 <Text style={{
//                     color: '#FFFFFF',
//                     fontSize: 20,
//                     fontWeight: 'bold',
//                 }}>{getInitials(patient.name)}</Text>
//             </View>

//             <View style={{ flex: 1, justifyContent: 'center' }}>
//                 <Text style={{
//                     fontSize: 17, // iOS Body size
//                     fontWeight: '600',
//                     marginBottom: 4,
//                     color: isDark ? '#FFFFFF' : '#000000'
//                 }}>
//                     {patient.name}
//                 </Text>
//                 <Text style={{
//                     fontSize: 15,
//                     color: isDark ? '#8E8E93' : '#3C3C4399', // Secondary label color iOS
//                 }}>
//                     Age: {patient.age} years
//                 </Text>
//                 <Text style={{
//                     fontSize: 15,
//                     color: isDark ? '#8E8E93' : '#3C3C4399', // Secondary label color iOS
//                 }}>
//                     Phone: {patient.phone}
//                 </Text>
//             </View>

//             {/* Arrow Icon */}
//             <MaterialIcons name="keyboard-arrow-right" size={30} color={isDark ? 'white' : 'black'} />
//         </Pressable>
import { Patient } from "@/types/user";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB",
];

interface PatientCardProps {
  patient: Patient;
  onPress?: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Generate consistent color based on patient name
  const avatarColor = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < patient.name.length; i++) {
      hash = patient.name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
  }, [patient.name]);

  const getInitials = (name: string) => {
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <Pressable
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        // Enhanced iOS Shadow for light mode
        shadowColor: isDark ? "#000" : "#D32F2F",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: isDark ? 4 : 8,
        // Enhanced Android Elevation
        elevation: isDark ? 4 : 3,
        backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
        opacity: pressed ? 0.8 : 1,
        borderWidth: isDark ? 0 : 1,
        borderColor: isDark ? "transparent" : "#F5E6E6",
        // Subtle transform on press
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
      onPress={onPress}
    >
      {/* Avatar with refined styling */}
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
          backgroundColor: avatarColor,
          // Subtle shadow on avatar
          shadowColor: avatarColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 20,
            fontFamily: "FunnelDisplay-Bold",
            letterSpacing: 0.5,
          }}
        >
          {getInitials(patient.name)}
        </Text>
      </View>

      {/* Patient Information */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 17,
            fontFamily: "FunnelDisplay-SemiBold",
            marginBottom: 6,
            color: isDark ? "#E0E0E0" : "#1C1C1E",
            letterSpacing: -0.3,
          }}
        >
          {patient.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <MaterialIcons
            name="cake"
            size={14}
            color={isDark ? "#98989D" : "#8E8E93"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontSize: 14,
              color: isDark ? "#98989D" : "#8E8E93",
              letterSpacing: -0.2,
              fontFamily: "FunnelDisplay-Regular",
            }}
          >
            {patient.Age} years
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="phone"
            size={14}
            color={isDark ? "#98989D" : "#8E8E93"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontSize: 14,
              color: isDark ? "#98989D" : "#8E8E93",
              letterSpacing: -0.2,
              fontFamily: "FunnelDisplay-Regular",
            }}
          >
            {patient.phone || "N/A"}
          </Text>
        </View>
      </View>

      {/* Arrow Icon with accent color */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: isDark ? "#3A3A3C" : "#F2F2F7",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color={isDark ? "#FFFFFF" : "#1C1C1E"}
        />
      </View>
    </Pressable>
  );
};

export default PatientCard;
