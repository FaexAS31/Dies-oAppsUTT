/** @format */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTheme, FAB } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Avatar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Aprobadas from "./Aprobadas";
import Pendientes from "./Pendientes";
import Desaprobadas from "./Desaprobadas";
import CerrarSesion from "./Cerrarsesion";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
const Drawer = createDrawerNavigator();
import userImage from "../assets/users-vector-icon-png_260862.jpg";
import Usuarios from "./Usuarios";
import AgregarUsuario from "../components/FormularioAgregar";

const HomeScreen = () => {
  const [username, setUsername] = useState("");
  const [totalPendientes, setTotalPendientes] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData !== null) {
          const { firstName } = JSON.parse(userData);
          setUsername(firstName);
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTotalPendientes = async () => {
        try {
          const response = await fetch("http://localhost:3000/pendientes");
          const data = await response.json();

          let totalPendientesNum = 0;

          if (data && data.totalPendientes) {
            totalPendientesNum = data.totalPendientes;
          } else {
            console.error(
              "No se pudo obtener el número total de pendientes desde la API"
            );
          }

          setTotalPendientes(totalPendientesNum);
        } catch (error) {
          console.error(
            "Error al obtener el número total de pendientes:",
            error
          );
        }
      };

      fetchTotalPendientes();
    }, [])
  );
  return (
    <Drawer.Navigator
      initialRouteName='Home'
      drawerContent={(props) => (
        <CustomDrawerContent {...props} username={username} />
      )}>
      <Drawer.Screen name='Home'>
        {(props) => (
          <HomeContent
            {...props}
            username={username}
            totalPendientes={totalPendientes}
          />
        )}
      </Drawer.Screen>
      <Drawer.Screen name='Aprobadas' component={Aprobadas} />
      <Drawer.Screen name='Pendientes' component={Pendientes} />
      <Drawer.Screen name='Desaprobadas' component={Desaprobadas} />
      <Drawer.Screen name='Usuarios'>
        {(props) => <Usuarios user={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name='Agregar Usuario' component={AgregarUsuario} />
      <Drawer.Screen name='Cerrar Sesión' component={CerrarSesion} />
    </Drawer.Navigator>
  );
};

const HomeContent = ({ navigation, username, totalPendientes }) => {
  const { colors } = useTheme();

  const handleBoxPress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.welcomeText, { color: colors.text }]}>
        ¿Qué solicitudes deseas revisar hoy, {username}?
      </Text>

      <View style={styles.notificationContainer}>
        <TouchableOpacity onPress={() => handleBoxPress("Pendientes")}>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{totalPendientes}</Text>
            <FontAwesome name='bell' size={24} color='red' />
          </View>
        </TouchableOpacity>
      </View>

      <FAB
        style={[styles.fab, styles.pendientesFab]}
        icon='file-document-outline'
        label={`Solicitudes Pendientes (${totalPendientes})`}
        onPress={() => handleBoxPress("Pendientes")}
      />
      <View style={styles.buttonRow}>
        <FAB
          style={[
            styles.fab,
            { backgroundColor: colors.primary, width: "45%" },
          ]}
          icon='check-circle-outline'
          label='Solicitudes Aprobadas'
          onPress={() => handleBoxPress("Aprobadas")}
        />
        <FAB
          style={[
            styles.fab,
            { backgroundColor: colors.primary, width: "45%" },
          ]}
          icon='close-circle-outline'
          label='Solicitudes Desaprobadas'
          onPress={() => handleBoxPress("Desaprobadas")}
        />
      </View>

      {/* Nuevo FAB button para Usuarios */}
      <FAB
        style={[styles.fab, styles.usuariosFab]}
        icon='account-group'
        label='Usuarios'
        onPress={() => handleBoxPress("Usuarios")}
      />
    </View>
  );
};

const CustomDrawerContent = ({ navigation, username }) => {
  const { colors } = useTheme();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("sessionToken");
      await AsyncStorage.removeItem("user");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <DrawerContentScrollView style={{ backgroundColor: colors.surface }}>
      <View style={styles.drawerHeader}>
        <Avatar.Image size={64} source={userImage} />
        <Text style={[styles.drawerHeaderText, { color: colors.text }]}>
          {username}
        </Text>
      </View>
      <DrawerItem
        label='Home'
        onPress={() => navigation.navigate("Home")}
        inactiveTintColor={colors.text}
        activeTintColor={colors.primary}
      />
      <DrawerItem
        label='Solicitudes Aprobadas'
        onPress={() => navigation.navigate("Aprobadas")}
        inactiveTintColor={colors.text}
        activeTintColor={colors.primary}
      />
      <DrawerItem
        label='Solicitudes Pendientes'
        onPress={() => navigation.navigate("Pendientes")}
        inactiveTintColor={colors.text}
        activeTintColor={colors.primary}
      />
      <DrawerItem
        label='Solicitudes Desaprobadas'
        onPress={() => navigation.navigate("Desaprobadas")}
        inactiveTintColor={colors.text}
        activeTintColor={colors.primary}
      />
      <DrawerItem
        label='Usuarios'
        onPress={() => navigation.navigate("Usuarios")}
        inactiveTintColor={colors.text}
        activeTintColor={colors.primary}
      />
      <DrawerItem
        label='Agregar Usuario'
        onPress={() => navigation.navigate("Agregar Usuario")}
        inactiveTintColor={colors.text}
        activeTintColor={colors.primary}
      />
      <View style={styles.divider}></View>
      <DrawerItem
        label='Cerrar Sesión'
        onPress={handleLogout}
        inactiveTintColor={colors.text}
        activeTintColor={colors.primary}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    paddingBottom: 75,
  },
  fab: {
    marginVertical: 10,
    width: "100%",
  },
  pendientesFab: {
    marginBottom: 35,
    padding: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
  },
  drawerHeader: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  drawerHeaderText: {
    fontSize: 18,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 10,
  },
  notificationContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  usuariosFab: {
    marginBottom: 10,
    width: "45%",
  },
});

export default HomeScreen;
