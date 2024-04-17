/** @format */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { TextInput, Button, Text, useTheme, Portal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import logoImage from "../assets/PARAMO_LogoFinal.png";

const LoginForm = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const sessionToken = await AsyncStorage.getItem("sessionToken");
        if (sessionToken) {
          const userData = await AsyncStorage.getItem("user");
          setUser(JSON.parse(userData));
          navigation.navigate("Home");
        }
      } catch (error) {
        console.error("Error al verificar la sesión: ", error);
      }
    };

    verificarSesion();
  }, []);

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        setError("Por favor ingresa un usuario y contraseña válidos");
        setModalVisible(true);
        return;
      }

      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("sessionToken", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("profilePic", data.user.profilePic);

        setUser(data.user.username);
        Alert.alert("Inicio de sesión exitoso");
        navigation.navigate("Home", { username: data.user.firstName });
      } else {
        setError(data.error || "Error desconocido");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setError("Error de conexión con el servidor");
      setModalVisible(true);
    }
  };

  return (
    <ImageBackground
      source={"../assets/videoplayback.mp4"}
      style={styles.background}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.loginText}>Inicie sesión</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.inputMargin]}
            label='Username'
            placeholder='Ingresa tu usuario'
            value={username}
            onChangeText={setUsername}
          />
          <View style={styles.passwordInput}>
            <TextInput
              style={[styles.input, styles.inputMargin, styles.passwordInput]}
              label='Password'
              placeholder='Ingresa tu contraseña'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <MaterialCommunityIcons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color={colors.text}
              style={styles.icon}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>
        </View>
        <Button
          mode='contained'
          onPress={handleLogin}
          style={styles.buttonContainer}
          color='#007bff'>
          Login
        </Button>
      </View>

      <Portal>
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          transparent
          animationType='fade'>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{error}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "italic",
  },
  inputContainer: {
    width: "70%",
    alignItems: "center",
  },
  input: {
    width: "100%",
  },
  inputMargin: {
    marginVertical: 10,
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    width: 200,
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    position: "absolute",
    right: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default LoginForm;
