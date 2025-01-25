import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CountryPicker from "react-native-country-picker-modal";

const PhoneNumberEntry = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("GH");
  const [callingCode, setCallingCode] = useState("233");
  const [showPicker, setShowPicker] = useState(false);

  const navigation = useNavigation();

  const handleCountrySelect = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.shadowContainer}>
        <Text style={styles.title}>Enter your number</Text>
        <Text style={styles.subtitle}>
          We will send a code to verify your mobile number
        </Text>

        <View style={styles.inputContainer}>
          <CountryPicker
            withFilter
            withFlag
            withCallingCode
            countryCode={countryCode}
            onSelect={handleCountrySelect}
            visible={showPicker}
            onClose={() => setShowPicker(false)}
          />
          <Text style={styles.callingCode}>+{callingCode}</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>Log in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate("VerifyCodeScreen")}
      >
        <Text style={styles.continueText}>CONTINUE</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 8 },
  subtitle: { color: "gray", marginBottom: 15, fontSize: 14 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  callingCode: { fontSize: 16, marginHorizontal: 10 },
  input: { flex: 1, fontSize: 16, paddingVertical: 10 },
  googleButton: { alignItems: "center", marginBottom: 15 },
  googleText: { color: "#34D186", textDecorationLine: "underline" },
  continueButton: {
    backgroundColor: "#34D186",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  continueText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default PhoneNumberEntry;
