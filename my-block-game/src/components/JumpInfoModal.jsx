import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

export default function JumpInfoModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>📘 How Jumps Work</Text>

          <Text style={styles.label}>🔹 Jump Size</Text>
          <Text style={styles.desc}>
            This tells how far the ninja moves in **one jump**.  
            For example:  
            **Jump Size = 3 → Ninja jumps 3 blocks at once**
          </Text>

          <Text style={styles.label}>🔹 Jump Count</Text>
          <Text style={styles.desc}>
            This is how many times the ninja will jump.  
            Example:  
            **Jump Count = 4 → Ninja jumps 4 times**
          </Text>

          <Text style={styles.example}>
            🧮 Final Block = Jump Size × Jump Count  
            (But limited to block 5)
          </Text>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  desc: {
    fontSize: 15,
    color: "#444",
    marginTop: 5,
  },
  example: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    textAlign: "center",
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
