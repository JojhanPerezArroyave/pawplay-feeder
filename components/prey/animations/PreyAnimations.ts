import { Animated, Easing } from "react-native";
import { Position } from "../types";
import { PreyUtils } from "../utils/PreyUtils";

export class PreyAnimations {
  static createRotationAnimation(
    rotation: Animated.Value
  ): Animated.CompositeAnimation {
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    return Animated.loop(
      Animated.timing(rotation, {
        toValue: direction,
        duration: PreyUtils.random(3000, 6000),
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
  }

  static createCatchAnimation(
    scale: Animated.Value,
    opacity: Animated.Value
  ): Animated.CompositeAnimation {
    return Animated.parallel([
      Animated.timing(scale, {
        toValue: 1.5,
        duration: 150,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);
  }

  static resetCatchAnimation(
    scale: Animated.Value,
    opacity: Animated.Value,
    position: Animated.ValueXY,
    newPosition: Position
  ): void {
    position.setValue(newPosition);
    scale.setValue(1);
    opacity.setValue(1);
  }

  static getRotationInterpolation(rotation: Animated.Value): Animated.AnimatedAddition<string> {
    return rotation.interpolate({
      inputRange: [-1, 1],
      outputRange: ['-360deg', '360deg'],
    });
  }
}