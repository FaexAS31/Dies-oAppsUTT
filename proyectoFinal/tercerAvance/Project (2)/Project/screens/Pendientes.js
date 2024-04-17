/** @format */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Feather } from "@expo/vector-icons";

const PendientesScreen = ({ navigation }) => {
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    obtenerSolicitudesPendientes();
  }, []);

  const obtenerSolicitudesPendientes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/pendientes1", {
        timeout: 5000,
      });
      setSolicitudesPendientes(response.data);
    } catch (error) {
      console.error("Error al obtener las solicitudes pendientes:", error);
    }
  };

  const mostrarDetalles = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setModalVisible(true);
  };

  const aprobarSolicitud = async () => {
    try {
      const updatedSolicitudesPendientes = solicitudesPendientes.filter(
        (solicitud) => solicitud.idSolicitud !== selectedSolicitud.idSolicitud
      );
      setSolicitudesPendientes(updatedSolicitudesPendientes);

      await axios.post(
        `http://localhost:3000/aprobar/${selectedSolicitud.idSolicitud}`
      );

      setModalVisible(false);
    } catch (error) {
      console.error("Error al aprobar la solicitud:", error);
    }
  };

  const desaprobarSolicitud = async () => {
    try {
      const updatedSolicitudesPendientes = solicitudesPendientes.filter(
        (solicitud) => solicitud.idSolicitud !== selectedSolicitud.idSolicitud
      );
      setSolicitudesPendientes(updatedSolicitudesPendientes);

      await axios.post(
        `http://localhost:3000/desaprobar/${selectedSolicitud.idSolicitud}`
      );

      setModalVisible(false);
    } catch (error) {
      console.error("Error al desaprobar la solicitud:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitudes Pendientes</Text>
      <ScrollView>
        {solicitudesPendientes.map((solicitud, index) => (
          <Card key={solicitud.idSolicitud} containerStyle={styles.card}>
            <TouchableOpacity
              onPress={() => mostrarDetalles(solicitud)}
              onPressIn={() => setSelectedRow(index)}
              onPressOut={() => setSelectedRow(null)}
              activeOpacity={0.8}
              style={[styles.row, selectedRow === index && styles.selectedRow]}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  ID Solicitud: {solicitud.idSolicitud}
                </Text>
                <Text style={styles.cardText}>
                  Fecha Solicitud: {solicitud.fechaSolicitud}
                </Text>
                <Text style={styles.cardText}>
                  Justificación: {solicitud.justificacion}
                </Text>
              </View>
              <Feather name='plus-circle' size={24} color='black' />
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles de la Solicitud</Text>
            {selectedSolicitud && <View>{/* Detalles de la solicitud */}</View>}
            <TouchableOpacity
              onPress={() => aprobarSolicitud()}
              style={[styles.openButton, styles.aprobarButton]}>
              <Text style={styles.textStyle}>Aprobar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => desaprobarSolicitud()}
              style={[styles.openButton, styles.desaprobarButton]}>
              <Text style={styles.textStyle}>Desaprobar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.openButton, styles.cancelarButton]}>
              <Text style={[styles.textStyle, styles.cancelarText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedRow: {
    backgroundColor: "#e0e0e0",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 16,
    color: "#666",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
  },
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
    width: 150,
    alignItems: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    flex: 1,
    padding: 8,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    elevation: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  openButton: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  aprobarButton: {
    backgroundColor: "green",
    elevation: 3,
  },
  desaprobarButton: {
    backgroundColor: "red",
    elevation: 3,
  },
  cancelarButton: {
    borderColor: "black",
    borderWidth: 1,
  },
  cancelarText: {
    color: "black",
  },
});

export default PendientesScreen;
