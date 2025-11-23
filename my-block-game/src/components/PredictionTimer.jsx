import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PredictionTimer({ duration = 10, onExpire, isPaused }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (isPaused) return;

    if (timeLeft === 0) {
      onExpire();
      return;
    }

    const t = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [timeLeft, isPaused]);

  return (
    <View style={styles.timerBox}>
      <Text style={styles.timerText}>⏳ {timeLeft}s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timerBox: {
    backgroundColor: "#0008",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 10,
  },
  timerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },
});
