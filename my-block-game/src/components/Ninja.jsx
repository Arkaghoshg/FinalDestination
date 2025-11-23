import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Platform, View, Animated } from "react-native";

const LottieWeb =
  Platform.OS === "web" ? require("lottie-react").default : null;
const LottieMobile =
  Platform.OS !== "web" ? require("lottie-react-native").default : null;

/* -------------------------------------------------------------
   UNIVERSAL LOTTIE PLAYER (WEB + MOBILE SAFE)
-------------------------------------------------------------- */

const getLottieProps = (file) =>
  Platform.OS === "web"
    ? { animationData: file }
    : { source: file };

function LottiePlayer({ file, style, ...rest }) {
  if (Platform.OS === "web") {
    return (
      <View style={style}>
        <LottieWeb
          animationData={file}
          {...rest}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    );
  }

  return (
    <LottieMobile
      {...getLottieProps(file)}
      {...rest}
      autoSize={false}
      style={style}
    />
  );
}

/* -------------------------------------------------------------
   NINJA COMPONENT
-------------------------------------------------------------- */
export default function Ninja({ currentBlock = 0, state = "idle", size = 72 }) {
  const blockSpacing = 75;
  const NINJA_SIZE = size;

  /* ---------------------- Animations ---------------------- */
  const animations = {
    idle: require("../../assets/ninja/Ninja.json"),
    run: require("../../assets/ninja/Run_quickly.json"),
    jump: require("../../assets/ninja/jumping_candy.json"),
    win: require("../../assets/ninja/Winner.json"),
    fall: require("../../assets/ninja/Falling_Man_Animation.json"),
  };

  const effects = {
    dust: require("../../assets/effects/dust_cloud.json"),
    lightning: require("../../assets/effects/lightning_flash.json"),
    shockwave: require("../../assets/effects/shockwave_ring.json"),
  };

  /* ---------------------- Clone Trail ---------------------- */
  const [clones, setClones] = useState([]);
  const clonesRef = useRef([]);

  useEffect(() => {
    if (state === "running") {
      const id = Date.now();
      const x = currentBlock * blockSpacing;

      clonesRef.current = [...clonesRef.current.slice(-4), { id, x }];
      setClones([...clonesRef.current]);

      const t = setTimeout(() => {
        clonesRef.current = clonesRef.current.filter((c) => c.id !== id);
        setClones([...clonesRef.current]);
      }, 280);

      return () => clearTimeout(t);
    }

    clonesRef.current = [];
    setClones([]);
  }, [state, currentBlock]);

  /* ---------------------- Effects ---------------------- */
  const [showLightning, setShowLightning] = useState(false);
  const [showDust, setShowDust] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);

  useEffect(() => {
    if (state === "jump") {
      setShowLightning(true);
      setTimeout(() => setShowLightning(false), 450);
    }

    if (state === "win" || state === "fall") {
      setShowDust(true);
      if (state === "win") setShowShockwave(true);

      setTimeout(() => setShowDust(false), 850);
      setTimeout(() => setShowShockwave(false), 850);
    }
  }, [state]);

  /* ---------------------- Chakra Glow ---------------------- */
  const auraOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === "running") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(auraOpacity, {
            toValue: 1,
            duration: 260,
            useNativeDriver: true,
          }),
          Animated.timing(auraOpacity, {
            toValue: 0.4,
            duration: 260,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      auraOpacity.stopAnimation();
      auraOpacity.setValue(0);
    }
  }, [state]);

  /* ---------------------- Transform Helper ---------------------- */
  const transformX = (x) => ({
    transform: [{ translateX: x }],
  });

  /* -------------------------------------------------------------
     SINGLE RENDER LOGIC (fix: only ONE animation ever mounts)
  -------------------------------------------------------------- */

  const getMainAnimation = () => {
    switch (state) {
      case "running":
        return animations.run;
      case "jump":
        return animations.jump;
      case "win":
        return animations.win;
      case "fall":
        return animations.fall;
      default:
        return animations.idle;
    }
  };

  return (
    <View style={styles.container} pointerEvents="none">

      {/* ⭐ AURA ⭐ */}
      {state === "running" && (
        <Animated.View
          style={[
            styles.chakraGlow,
            { opacity: auraOpacity },
            transformX(currentBlock * blockSpacing - 10),
            {
              width: NINJA_SIZE * 1.25,
              height: NINJA_SIZE * 1.25,
              borderRadius: (NINJA_SIZE * 1.25) / 2,
            },
          ]}
        />
      )}

      {/* ⭐ CLONE TRAIL ⭐ */}
      {clones.map((c, i) => (
        <Animated.View
          key={c.id}
          style={[
            styles.cloneWrapper,
            transformX(c.x),
            { opacity: 0.55 - i * 0.12, width: NINJA_SIZE, height: NINJA_SIZE },
          ]}
        >
          <LottiePlayer
            file={animations.run}
            autoPlay
            loop
            style={styles.cloneAnim}
          />
        </Animated.View>
      ))}

      {/* ⚡ LIGHTNING */}
      {showLightning && (
        <LottiePlayer
          file={effects.lightning}
          autoPlay
          loop={false}
          style={[styles.lightning, transformX(currentBlock * blockSpacing - 14)]}
        />
      )}

      {/* 🥷 MAIN NINJA — PERFECTLY SWITCHES */}
      <LottiePlayer
        file={getMainAnimation()}
        autoPlay
        loop={state === "running"}
        style={[
          styles.ninja,
          transformX(currentBlock * blockSpacing),
          { width: NINJA_SIZE, height: NINJA_SIZE },
        ]}
      />

      {/* 💥 SHOCKWAVE */}
      {showShockwave && (
        <LottiePlayer
          file={effects.shockwave}
          autoPlay
          loop={false}
          style={[
            styles.shockwave,
            transformX(currentBlock * blockSpacing - 34),
            { width: NINJA_SIZE * 1.8, height: NINJA_SIZE * 1.8, bottom: -NINJA_SIZE * 0.3 },
          ]}
        />
      )}

      {/* 🌫️ DUST */}
      {showDust && (
        <LottiePlayer
          file={effects.dust}
          autoPlay
          loop={false}
          style={[
            styles.dust,
            transformX(currentBlock * blockSpacing - 20),
            { width: NINJA_SIZE * 1.5, height: NINJA_SIZE * 0.9, bottom: -NINJA_SIZE * 0.15 },
          ]}
        />
      )}
    </View>
  );
}

/* -------------------------------------------------------------
   💅 STYLES
-------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: 140,
    bottom: 8,
  },

  ninja: {
    width: 92,
    height: 92,
    position: "absolute",
    bottom: 6,
  },

  cloneWrapper: {
    width: 92,
    height: 92,
    position: "absolute",
    bottom: 6,
  },

  cloneAnim: {
    width: "100%",
    height: "100%",
  },

  chakraGlow: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#4db8ff",
    bottom: 4,
  },

  lightning: {
    width: 120,
    height: 120,
    position: "absolute",
    bottom: -10,
  },

  shockwave: {
    width: 160,
    height: 160,
    position: "absolute",
    bottom: -30,
  },

  dust: {
    width: 140,
    height: 80,
    position: "absolute",
    bottom: -10,
  },
});

