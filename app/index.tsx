import React, { useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";


export default function HomeScreen() {
  const [taps, setTaps] = useState(0);
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  const scaleValue = new Animated.Value(1);

  const handlePress = () => {
    setTaps((prev) => prev + 1);
    
    // Animación de presión
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    console.log("🐭 ¡El gato tocó la presa!");
    Alert.alert(
      "¡Presa cazada! 🐾", 
      `El gato ha tocado la pantalla ${taps + 1} veces`,
      [{ text: "¡Genial!", style: "default" }]
    );
  };

  return (
    <View style={[styles.container, isLandscape && styles.landscapeContainer]}>
      <View style={[styles.content, isLandscape && styles.landscapeContent]}>
        <Text style={[styles.title, isLandscape && styles.landscapeTitle]}>
          🐱 Pawplay Feeder
        </Text>

        <View style={styles.gameArea}>
          <TouchableOpacity 
            onPress={handlePress} 
            activeOpacity={0.8}
            style={[styles.touchArea, isLandscape && styles.landscapeTouchArea]}
          >
            <Animated.View 
              style={[
                styles.imageContainer,
                { transform: [{ scale: scaleValue }] }
              ]}
            >
              <Image
                source={require("../assets/images/mouse.png")}
                style={[styles.mouseImage, isLandscape && styles.landscapeMouseImage]}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Text style={[styles.counter, isLandscape && styles.landscapeCounter]}>
            Toques: {taps}
          </Text>
          <Text style={styles.subtitle}>
            ¡Toca al ratón! 🎯
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
    padding: 20,
  },
  landscapeContainer: {
    paddingHorizontal: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  landscapeContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#f8fafc",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 30,
    letterSpacing: 1,
  },
  landscapeTitle: {
    fontSize: 28,
    marginBottom: 0,
    flex: 0.3,
  },
  gameArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  touchArea: {
    backgroundColor: "#3b82f6",
    borderRadius: 25,
    padding: 35,
    borderWidth: 4,
    borderColor: "#60a5fa",
    shadowColor: "#1e40af",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
  },
  landscapeTouchArea: {
    padding: 25,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  mouseImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  landscapeMouseImage: {
    width: 140,
    height: 140,
  },
  statsContainer: {
    alignItems: "center",
    backgroundColor: "#334155",
    borderRadius: 20,
    padding: 25,
    minWidth: 220,
    borderWidth: 2,
    borderColor: "#475569",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  counter: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fbbf24",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  landscapeCounter: {
    fontSize: 22,
  },
  subtitle: {
    fontSize: 18,
    color: "#94a3b8",
    fontWeight: "600",
    textAlign: "center",
  },
});
