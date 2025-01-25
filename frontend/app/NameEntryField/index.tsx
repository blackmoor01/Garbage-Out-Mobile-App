import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Checkbox, Provider } from "react-native-paper";  // Import Provider from react-native-paper

const NameEntryScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const navigation = useNavigation();

  const handleContinue = () => {
    if (!firstName || !lastName) {
      Alert.alert("Error", "Please enter both your first and last names");
      return;
    }
    if (!isTermsAccepted) {
      Alert.alert(
        "Error",
        "You must accept the terms and conditions to continue"
      );
      return;
    }
    alert(`Welcome, ${firstName} ${lastName}`);
  };

  return (
    <Provider>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.title}>Enter Your Name</Text>
        <Text style={styles.subtitle}>
          This name will be displayed on your profile.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            placeholderTextColor="#888"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            placeholderTextColor="#888"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>

        {/* Checkboxes */}
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={isTermsAccepted ? "checked" : "unchecked"}
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
            />
            <Text style={styles.checkboxLabel}>
              I accept the terms and conditions
            </Text>
          </View>

          <View style={styles.checkboxRow}>
            <Checkbox
              status={isNotificationsEnabled ? "checked" : "unchecked"}
              onPress={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
            />
            <Text style={styles.checkboxLabel}>I want regular notifications</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: { color: "gray", marginBottom: 20, textAlign: "center" },
  inputContainer: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  continueButton: {
    backgroundColor: "#27ae60",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  continueText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  checkboxContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
});

export default NameEntryScreen;
