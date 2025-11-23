import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from "react-native";

export default function Leaderboard({ visible, onClose, data }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  const rowOpacity = useRef([]).current;

  /* 🔥 Recreate row opacity array when data changes */
  useEffect(() => {
    rowOpacity.length = 0;
    data.forEach(() => rowOpacity.push(new Animated.Value(0)));
  }, [data]);

  /* 🔥 Animate leaderboard open */
  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.7);

      // Reset row opacity instantly
      rowOpacity.forEach((v) => v.setValue(0));

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  /* 🔥 Animate rows after content renders */
  const animateRows = () => {
    const animations = rowOpacity.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: i * 80,
        useNativeDriver: true,
      })
    );
    Animated.stagger(80, animations).start();
  };

  /* 🔥 Safe renderItem */
  const renderItem = ({ item, index }) => {
    const medal = ["#FFD700", "#C0C0C0", "#CD7F32"];

    // Ensure opacity exists
    const opacity = rowOpacity[index] || new Animated.Value(0);

    return (
      <Animated.View
        style={[
          styles.item,
          { borderColor: medal[index] || "#aaa" },
          { opacity },
          {
            transform: [
              {
                translateY: opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={[styles.rank, { color: medal[index] }]}>{index + 1}</Text>
        <Text style={styles.name}>{item.username}</Text>
        <Text style={styles.points}>{item.points} pts</Text>
      </Animated.View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[styles.box, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.title}>🏆 Leaderboard</Text>

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id || index.toString()}
            onContentSizeChange={animateRows}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 20,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    maxHeight: "80%",
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    width: 30,
    textAlign: "center",
  },
  name: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  points: {
    fontSize: 16,
    color: "#444",
  },
  closeBtn: {
    backgroundColor: "#222",
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 20,
  },
  closeText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
});
