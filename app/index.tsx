import React, { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";


export default function HomeScreen() {
  const [taps, setTaps] = useState(0);

  const handlePress = () => {
    setTaps((prev) => prev + 1);
    console.log("🐭 ¡El gato tocó la presa!");
    Alert.alert("¡Presa cazada!", "El gato ha tocado la pantalla 🐾");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐱 Pawplay Feeder</Text>

      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Image
          source={require("../assets/images/mouse.png")}
          style={styles.mouseImage}
        />
      </TouchableOpacity>

      <Text style={styles.counter}>Toques: {taps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3E2723",
  },
  mouseImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  counter: {
    fontSize: 20,
    color: "#5D4037",
  },
});
