import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const slides = [
    {
      image: require("../../assets/images/onbord1 1.png"),
      title: "Clean Environment",
      description: "Lorem ipsum dolor sit amet, consectetur.",
    },
    {
      image: require("../../assets/images/undraw_schedule_re_2vro 1.png"),
      title: "Organize Your Day",
      description: "Plan and manage your tasks efficiently.",
    },
    {
      image: require("../../assets/images/undraw_fresh_notification_re_whq4 1.png"),
      title: "Stay Informed",
      description: "Get timely updates and notifications.",
    },
  ];

  return (
    <Swiper
      loop={false}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
    >
      {slides.map((slide, index) => (
        <View style={styles.slide} key={index}>
          <View style={styles.imageContainer}>
            <Image
              source={slide.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.shadowContainer]}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
          {index === slides.length - 1 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("PhoneNumberEntry")}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    width: "100%",
    height: height * 0.6,
    backgroundColor: "#55A57F",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 30,
  },
  image: {
    width: width * 0.8,
    height: width * 0.6,
  },
  shadowContainer: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    borderRadius: 15,
    padding: 2,
    marginHorizontal: 20,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666666",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#34D186",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dot: {
    backgroundColor: "#CCCCCC",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#34C759",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
});

export default OnboardingScreen;
