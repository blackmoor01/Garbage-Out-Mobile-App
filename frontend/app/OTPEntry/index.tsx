import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const VerifyCodeScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [modalVisible, setModalVisible] = useState(false);
  const inputs = useRef([]);
  const navigation = useNavigation();

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const verifyCode = () => {
    const enteredCode = otp.join("");
    if (enteredCode.length < 6) {
      alert("Please enter all 6 digits of the verification code.");
    } else {
      // Simulate verification process
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate("NameEntryScreen"); // Allow navigation for any 6-digit code
      }, 2000); // Simulate a delay for verification
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        We sent a 6-digit verification code to your number. Enter it below.
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              nativeEvent.key === "Backspace"
                ? handleBackspace("", index)
                : null
            }
          />
        ))}
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={verifyCode}>
        <Text style={styles.verifyText}>VERIFY</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendButton}>
        <Text style={styles.resendText}>Resend Code in 00:30</Text>
      </TouchableOpacity>

      {/* Modal for feedback */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#34D186" />
            <Text style={styles.modalText}>Verifying Code...</Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
    elevation: 3,
  },
  verifyButton: {
    backgroundColor: "#34D186",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  verifyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resendButton: {
    alignItems: "center",
  },
  resendText: {
    color: "#2196F3",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 10,
  },
  modalText: {
    marginTop: 15,
    fontSize: 16,
    color: "gray",
  },
});

export default VerifyCodeScreen;
