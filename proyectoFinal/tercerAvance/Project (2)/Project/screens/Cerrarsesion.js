/** @format */

import React, { useState } from "react";
import { View, Button, StyleSheet, Text, Alert, Modal } from "react-native"; // Agrega la importación del componente Text
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const CerrarSesion = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem("sessionToken");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title='Cerrar Sesión' onPress={() => setModalVisible(true)} />
      {/* Modal para confirmar el cierre de sesión */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            ¿Estás seguro que deseas cerrar sesión?
          </Text>
          <Button title='Cancelar' onPress={() => setModalVisible(false)} />
          <Button title='Confirmar' onPress={confirmLogout} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default CerrarSesion;
