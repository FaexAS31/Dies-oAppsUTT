/** @format */
 // comentario inicio
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import LoginForm from "./components/LoginForm";
import HomeScreen from "./screens/HomeScreen";
import Usuarios from "./screens/Usuarios";
import FormularioAgregar from "./components/FormularioAgregar";

import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = {
  getItem: async (key) => AsyncStorage.getItem(key),
  setItem: async (key, value) => AsyncStorage.setItem(key, value),
  removeItem: async (key) => AsyncStorage.removeItem(key),
};

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionToken = await storage.getItem("sessionToken");
        if (sessionToken) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error al verificar la sesión: ", error);
      }
    };

    checkSession();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen
              name='Login'
              component={LoginForm}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Home'
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='LoginForm'
              component={LoginForm}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Usuarios'
              component={Usuarios}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='FormularioAgregar'
              component={FormularioAgregar}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#007bff",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
