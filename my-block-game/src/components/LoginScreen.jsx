import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen({ username, setUsername, setIsLoggedIn }) {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStart = () => {
    if (username.trim().length < 3) {
      Alert.alert("Name too short!", "Minimum 3 characters required.");
      return;
    }
    setIsLoggedIn(true);
  };

  return (
    <LinearGradient colors={["#74ebd5", "#ACB6E5"]} style={styles.container}>
      <View style={styles.loginBox}>

        <Text style={styles.loginTitle}>Enter Your Name</Text>

        {/* ⭐ Show Instructions Button ⭐ */}
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setShowInstructions(true)}
        >
          <Text style={styles.infoButtonText}>📘 How to Play</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleStart}>
          <Text style={styles.loginBtnText}>Start Game</Text>
        </TouchableOpacity>
      </View>

      {/* ⭐ Instructions Modal ⭐ */}
      <Modal visible={showInstructions} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView contentContainerStyle={{ padding: 15 }}>
              <Text style={styles.modalTitle}>📘 How the Game Works</Text>

              <Text style={styles.modalText}>
                ▶️ You will see **5 numbered blocks** (1 to 5).
              </Text>

              <Text style={styles.modalText}>
                ▶️ The Ninja moves based on two hidden values:
                {"\n"}• **Jump Size** (steps he takes each jump)
                {"\n"}• **Jump Count** (how many jumps he makes)
              </Text>

              <Text style={styles.modalText}>
                ▶️ Example:
                {"\n"}Jump Size = 2, Jump Count = 3
                {"\n"}Path: 0 → 2 → 4 → 1 (wrap-around)
                {"\n"}Final block = **1**
              </Text>

              <Text style={styles.modalText}>
                ▶️ Your goal:
                {"\n"}**Predict the final block** before the Ninja starts moving.
              </Text>

              <Text style={styles.sectionHeader}>⏳ Timer Rule</Text>

              <Text style={styles.modalText}>
                ▶️ After starting the game, you get **15 seconds** to choose.
                {"\n"}▶️ If timer ends → **Automatic Fail**.
              </Text>

              <Text style={styles.sectionHeader}>🏆 Rewards</Text>

              <Text style={styles.modalText}>
                ✔ Correct guess = **+10 points**
                {"\n"}❌ Wrong guess or timeout = No points
                {"\n"}⭐ You can always tap **Next Round** to continue.
              </Text>

              <Text style={styles.footer}>
                Good luck! Predict wisely! 🎯
              </Text>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowInstructions(false)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loginBox: {
    backgroundColor: "#ffffff33",
    padding: 20,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff66",
  },

  loginTitle: {
    fontSize: 26,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },

  infoButton: {
    backgroundColor: "#1e3a8a",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  infoButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    width: "100%",
    backgroundColor: "#ffffff55",
    padding: 10,
    borderRadius: 10,
    color: "#000",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#fff",
  },

  loginBtn: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 10,
  },

  loginBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  /* ⭐ Modal Styles ⭐ */
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    backgroundColor: "#ffffffee",
    borderRadius: 15,
    maxHeight: "85%",
    paddingBottom: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  modalText: {
    fontSize: 15,
    marginBottom: 10,
    color: "#333",
    lineHeight: 22,
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },

  footer: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
  },

  closeBtn: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 12,
    marginTop: 15,
  },

  closeBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
