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

const AprobadasScreen = ({ navigation }) => {
  const [solicitudesAprobadas, setSolicitudesAprobadas] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    obtenerSolicitudesAprobadas();
  }, []);

  const obtenerSolicitudesAprobadas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/aprobadas", {
        timeout: 5000,
      });
      setSolicitudesAprobadas(response.data);
    } catch (error) {
      console.error("Error al obtener las solicitudes aprobadas:", error);
    }
  };

  const mostrarDetalles = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitudes Aprobadas</Text>
      <ScrollView>
        {solicitudesAprobadas.map((solicitud, index) => (
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
            {selectedSolicitud && (
              <View>
                <Text>ID Solicitud: {selectedSolicitud.idSolicitud}</Text>
                <Text>Fecha Solicitud: {selectedSolicitud.fechaSolicitud}</Text>
                <Text>
                  Estado Solicitud: {selectedSolicitud.estadoSolicitud}
                </Text>
                <Text>Justificación: {selectedSolicitud.justificacion}</Text>
                <Text>Comentario: {selectedSolicitud.comentario}</Text>
                <Text>Cantidad: {selectedSolicitud.cantidad}</Text>
                <Text>Nombre Usuario: {selectedSolicitud.nombreUsuario}</Text>
                <Text>Nombre Producto: {selectedSolicitud.nombreProducto}</Text>
                <Text>Prioridad: {selectedSolicitud.prioridad}</Text>
                <Text>Estado Entrega: {selectedSolicitud.estadoEntrega}</Text>
                {/* Agrega más detalles aquí según la estructura de tu objeto de solicitud */}
              </View>
            )}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.openButton, styles.cancelarButton]}>
              <Text style={[styles.textStyle, styles.cancelarText]}>
                Cerrar
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
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
  },
  openButton: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: "60%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  textStyle: {
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#FF6347",
  },
  cancelarText: {
    color: "black",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    elevation: 4,
    topPadding: 10,
  },
  backButton: {
    padding: 8,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
});

export default AprobadasScreen;
