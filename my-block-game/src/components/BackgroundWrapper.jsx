import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function BackgroundWrapper({ children }) {

  const themes = {
    aqua: ["#74ebd5", "#ACB6E5"],
    sunset: ["#ff9a9e", "#fad0c4"],
    neon: ["#00eaff", "#0066ff"],
  };

  const [theme, setTheme] = useState("aqua");

  const cycleTheme = () => {
    setTheme((prev) =>
      prev === "aqua" ? "sunset" : prev === "sunset" ? "neon" : "aqua"
    );
  };


  const animateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animateValue, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: false,
        }),
        Animated.timing(animateValue, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const animatedStart = animateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const cloudX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateClouds = () => {
      cloudX.setValue(0); // reset instantly

      Animated.timing(cloudX, {
        toValue: -width,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => animateClouds());
    };

    animateClouds();
  }, []);

  const cloudTranslate = cloudX.interpolate({
    inputRange: [-width, 0],
    outputRange: [-width, 0],
  });

  const particles = Array.from({ length: 15 }).map(() => ({
    x: Math.random() * width,
    size: 6 + Math.random() * 10,
    delay: Math.random() * 4000,
    duration: 8000 + Math.random() * 4000,
  }));

  const renderParticles = () => {
    return particles.map((p, i) => {
      const floatAnim = new Animated.Value(height + 30);

      Animated.loop(
        Animated.timing(floatAnim, {
          toValue: -50,
          duration: p.duration,
          delay: p.delay,
          useNativeDriver: true,
        })
      ).start();

      return (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: 50,
            backgroundColor: "rgba(255,255,255,0.35)",
            left: p.x,
            transform: [{ translateY: floatAnim }],
          }}
        />
      );
    });
  };

  return (
    <View style={styles.fullScreen}>
      {/* ✨ Animated Gradient Background */}
      <Animated.View
        style={[
          styles.gradientWrapper,
          {
            transform: [{ translateY: animatedStart }],
          },
        ]}
      >
        <LinearGradient colors={themes[theme]} style={styles.gradient} />
      </Animated.View>

      {/* ☁️ Infinite Repeating Clouds */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: width * 2, // double width (two images)
          height: height,
          flexDirection: "row",
          transform: [{ translateX: cloudTranslate }],
        }}
      >
        <Image
          source={require("../../assets/background/cloud.png")}
          style={styles.cloudImage}
          resizeMode="cover"
        />
        <Image
          source={require("../../assets/background/cloud.png")}
          style={styles.cloudImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* ✨ Particles */}
      {renderParticles()}

      {/* MAIN CONTENT */}
      <View style={styles.childrenWrapper}>{children}</View>

      {/* 🎨 THEME BUTTON */}
      <TouchableOpacity style={styles.themeBtn} onPress={cycleTheme}>
        <Text style={styles.themeText}>🎨 Theme</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    overflow: "hidden",
  },

  gradientWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },

  gradient: {
    width: "100%",
    height: "100%",
  },

  childrenWrapper: {
    flex: 1,
    zIndex: 5,
  },

  themeBtn: {
    position: "absolute",
    top: 65,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },

  themeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  cloudImage: {
    width: width,
    height: height,
    opacity: 0.18,
  },
});
