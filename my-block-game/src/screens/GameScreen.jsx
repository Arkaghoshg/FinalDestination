import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import ConfettiCannon from "react-native-confetti-cannon";
import { addPoints, getLeaderboard } from "../Connect";

import LoginScreen from "../components/LoginScreen";
import Ninja from "../components/Ninja";
import JumpInfoModal from "../components/JumpInfoModal";
import PredictionTimer from "../components/PredictionTimer";
import Leaderboard from "../components/Leaderboard";
import BackgroundWrapper from "../components/BackgroundWrapper";

import { playSound, stopSound, setMuted } from "../sounds/soundManager";

export default function GameScreen() {
  const totalBlocks = 5;

  const { width } = useWindowDimensions();

  /** -----------------------------------
   * RESPONSIVE VALUES
   * ----------------------------------- */
  const BLOCK_SIZE = Math.min(80, width * 0.16);
  const BLOCK_MARGIN = Math.min(14, width * 0.03);
  const BUTTON_WIDTH = Math.min(90, width * 0.22);

  /** -----------------------------------
   * STATES
   * ----------------------------------- */
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentBlock, setCurrentBlock] = useState(0);
  const [predictedBlock, setPredictedBlock] = useState(null);
  const [finalDestination, setFinalDestination] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [ninjaState, setNinjaState] = useState("idle");

  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);

  const [jumps, setJumps] = useState(0);
  const [moves, setMoves] = useState(0);

  const [glowIndex, setGlowIndex] = useState(null);
  const [roundEnded, setRoundEnded] = useState(false);

  // TIMER
  const [timerKey, setTimerKey] = useState(0);
  const [timerPaused, setTimerPaused] = useState(false);
  const [autoFailed, setAutoFailed] = useState(false);

  const pathRef = useRef([]);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const runSoundRef = useRef(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [soundOn] = useState(true);

  /** -----------------------------------
   * SOUND
   * ----------------------------------- */
  useEffect(() => {
    setMuted(!soundOn);
  }, [soundOn]);

  /** -----------------------------------
   * Stickman idle bounce
   * ----------------------------------- */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  /** -----------------------------------
   * LOGIN → START ROUND
   * ----------------------------------- */
  useEffect(() => {
    if (isLoggedIn) {
      startNewRound();
      (async () => {
        const lb = await getLeaderboard();
        setLeaderboard(lb || []);
      })();
    }
  }, [isLoggedIn]);

  /** -----------------------------------
   * START NEW ROUND
   * ----------------------------------- */
  const startNewRound = async () => {
    const jumpSize = Math.floor(Math.random() * 3) + 1;
    const jumpCount = Math.floor(Math.random() * 5) + 1;

    const steps = [];
    let pos = 0;

    for (let i = 1; i <= jumpCount; i++) {
      pos = (pos + jumpSize) % totalBlocks;
      steps.push(pos);
    }

    pathRef.current = steps;
    setFinalDestination(steps[steps.length - 1]);

    setJumps(jumpSize);
    setMoves(jumpCount);

    setRoundEnded(false);
    setCurrentBlock(0);
    setPredictedBlock(null);
    setShowConfetti(false);
    setGlowIndex(null);
    setNinjaState("idle");

    // reset timer
    setTimerKey((k) => k + 1);
    setTimerPaused(false);
    setAutoFailed(false);

    try {
      const lb = await getLeaderboard();
      setLeaderboard(lb || []);
    } catch {}
  };

  /** -----------------------------------
   * USER PREDICTION
   * ----------------------------------- */
  const handlePrediction = async (blockIndex) => {
    if (isMoving || roundEnded || autoFailed) return;

    playSound("click");

    setPredictedBlock(blockIndex);
    setRoundEnded(true);
    setIsMoving(true);
    setNinjaState("running");

    setTimerPaused(true);

    try {
      const s = await playSound("run", { loop: true });
      runSoundRef.current = s;
    } catch {}
  };

  /** -----------------------------------
   * TIMER EXPIRED
   * ----------------------------------- */
  const handleTimerExpire = () => {
    if (predictedBlock !== null) return;

    setTimerPaused(true);
    setAutoFailed(true);
    setRoundEnded(true);

    setNinjaState("fall");
    playSound("wrong");
  };

  /** -----------------------------------
   * MOVEMENT ANIMATION
   * ----------------------------------- */
  useEffect(() => {
    if (!isMoving) return;

    const steps = pathRef.current;
    let idx = 0;

    const t = setInterval(() => {
      if (idx < steps.length) {
        setCurrentBlock(steps[idx]);
        idx++;
      } else {
        clearInterval(t);
        onMovementComplete();
      }
    }, 850);

    return () => clearInterval(t);
  }, [isMoving]);

  /** -----------------------------------
   * AFTER MOVEMENT
   * ----------------------------------- */
  const onMovementComplete = async () => {
    if (runSoundRef.current) {
      await stopSound(runSoundRef.current).catch(() => {});
      runSoundRef.current = null;
    }

    setIsMoving(false);
    const correct = predictedBlock === finalDestination;

    playSound("land");

    setTimeout(async () => {
      if (correct) {
        setNinjaState("win");
        setShowConfetti(true);
        playSound("correct");

        try {
          await addPoints(username, 10);
          const updated = await getLeaderboard();
          setLeaderboard(updated || []);
        } catch {}
      } else {
        setNinjaState("fall");
        playSound("wrong");

        setGlowIndex(finalDestination);
        setTimeout(() => setGlowIndex(null), 1800);
      }

      setTimeout(() => {
        setNinjaState("idle");
        setCurrentBlock(0);
      }, 1500);
    }, 300);
  };

  /** -----------------------------------
   * LOGIN PAGE
   * ----------------------------------- */
  if (!isLoggedIn) {
    return (
      <LoginScreen
        username={username}
        setUsername={setUsername}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  /** -----------------------------------
   * MAIN GAME UI
   * ----------------------------------- */
  return (
    <BackgroundWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🥷 Final Destination</Text>

        {!autoFailed && (
          <PredictionTimer
            key={timerKey}
            duration={15}
            isPaused={timerPaused}
            onExpire={handleTimerExpire}
          />
        )}

        {autoFailed && (
          <Text style={styles.failText}>⏳ Time’s Up! Try Again</Text>
        )}

        <Text style={styles.infoText}>Jump Size: {jumps}</Text>
        <Text style={styles.infoText}>Jump Count: {moves}</Text>

        <TouchableOpacity onPress={() => setInfoVisible(true)}>
          <Text style={styles.helpText}>❓ What do jumps mean?</Text>
        </TouchableOpacity>

        {/* BLOCKS + NINJA */}
        <View style={styles.blocksContainer}>
          <View style={[styles.blocksRow, { height: BLOCK_SIZE + 40 }]}>
            {[...Array(totalBlocks)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.block,
                  {
                    width: BLOCK_SIZE - 8,
                    height: BLOCK_SIZE,
                    margin: BLOCK_MARGIN,
                  },
                  glowIndex === index && styles.glowBlock,
                ]}
              >
                <Text style={styles.blockText}>{index + 1}</Text>
              </View>
            ))}

            <Animated.View
              style={[
                styles.stickmanContainer,
                { 
                  transform: [{ scale: bounceAnim }],
                  bottom: BLOCK_SIZE + 14,
                  left: 20 },
              ]}
            >
              <Ninja currentBlock={currentBlock} state={ninjaState} />
            </Animated.View>
          </View>
        </View>

        {/* PREDICTION BUTTONS */}
        {!autoFailed && (
          <View style={styles.buttons}>
            {[...Array(totalBlocks)].map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  { width: BUTTON_WIDTH },
                  predictedBlock === index && styles.selectedButton,
                ]}
                onPress={() => handlePrediction(index)}
                disabled={isMoving || roundEnded}
              >
                <Text style={styles.buttonText}>{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* NEXT ROUND */}
        <TouchableOpacity style={styles.resetBtn} onPress={startNewRound}>
          <Text style={styles.resetText}>🔄 Next Round</Text>
        </TouchableOpacity>

        {/* LEADERBOARD */}
        <TouchableOpacity
          style={styles.showLeaderboardBtn}
          onPress={() => setLeaderboardVisible(true)}
        >
          <Text style={styles.showLeaderboardText}>🏆 Show Leaderboard</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODALS */}
      <Leaderboard
        visible={leaderboardVisible}
        onClose={() => setLeaderboardVisible(false)}
        data={leaderboard}
      />

      <JumpInfoModal
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
      />

      {showConfetti && <ConfettiCannon count={120} origin={{ x: 200, y: -20 }} />}
    </BackgroundWrapper>
  );
}

/* ======================================================
       STYLES
====================================================== */
const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 30,
    marginBottom: 20,
  },

  helpText: {
    color: "#fff",
    marginTop: 6,
    marginBottom: 14,
    fontSize: 15,
  },

  infoText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  failText: {
    color: "#ff4444",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  blocksContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },

  blocksRow: {
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
  },

  block: {
    backgroundColor: "#ffffff40",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },

  glowBlock: {
    borderColor: "#00eaff",
    backgroundColor: "#00eaff40",
    shadowColor: "#00eaff",
    shadowRadius: 12,
    shadowOpacity: 0.85,
  },

  blockText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  stickmanContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 140,
    pointerEvents: "none",
  },

  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 18,
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#ffffff33",
    paddingVertical: 10,
    borderRadius: 10,
    margin: 6,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
  },

  selectedButton: {
    backgroundColor: "#FFD700aa",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  resetBtn: {
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
  },

  resetText: {
    color: "#fff",
    fontSize: 17,
  },

  showLeaderboardBtn: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
  },

  showLeaderboardText: {
    color: "#222",
    fontSize: 18,
    fontWeight: "bold",
  },
});
