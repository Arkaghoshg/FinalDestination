import React from "react";
import { Pressable } from "react-native-gesture-handler";
import Animated, {useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

function Block({ size = 70, color = "#4F46E5", onPress }) {

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() =>({
        transform: [{ scale: scale.value}],
        backgroundColor: color
    }));
  return (
    <Pressable onPressIn={() => (scale.value = withSpring(0.9))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        margin: 5,
        borderRadius: 10,
      }}
    >
    <Animated.View
        style={[
            {width: size - 20,
            height: size - 20,
            backgroundColor: "white",
            borderRadius: 5},
            animatedStyle
        ]}
    />
    </Pressable>
  );
}

export default Block;
