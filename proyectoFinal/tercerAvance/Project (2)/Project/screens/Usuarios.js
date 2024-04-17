/** @format */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { DataTable, FAB, IconButton } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const UsuariosScreen = () => {
  const [usuariosActivos, setUsuariosActivos] = useState([]);
  const [usuariosInactivos, setUsuariosInactivos] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        setUserData(JSON.parse(userData));
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    const cargarUsuarios = async () => {
      try {
        const responseActivos = await axios.get(
          "http://localhost:3000/usuarios/activos"
        );
        const responseInactivos = await axios.get(
          "http://localhost:3000/usuarios/inactivos"
        );
        setUsuariosActivos(responseActivos.data);
        setUsuariosInactivos(responseInactivos.data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    cargarDatosUsuario();

    const interval = setInterval(() => {
      cargarUsuarios();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const toggleEstadoUsuario = async (idUsuario, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:3000/usuarios/${idUsuario}`, {
        status: nuevoEstado,
      });
      cargarUsuarios();
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error);
    }
  };

  const verMasInfoUsuario = (usuario) => {
    setSelectedUser(usuario);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.tituloTabla}>Usuarios Activos</Text>
        <FAB
          style={styles.fab}
          icon='plus'
          label='Agregar Usuario'
          onPress={() => navigation.navigate("FormularioAgregar")}
        />
        <DataTable style={styles.tabla}>
          <DataTable.Header>
            <DataTable.Title>Nombre</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title>Acciones</DataTable.Title>
          </DataTable.Header>
          {usuariosActivos.map((usuario) => (
            <DataTable.Row
              key={usuario.user_id}
              style={
                userData &&
                (usuario.category === 1 || usuario.user_id === userData.id)
                  ? styles.filaAdmin
                  : null
              }>
              <DataTable.Cell>
                {usuario.first_name} {usuario.last_name}
              </DataTable.Cell>
              <DataTable.Cell>
                {usuario.user_id !== userData.id ? (
                  usuario.category === 1 ? (
                    <Text>
                      {usuario.status === "activo" ? "Activo" : "Inactivo"}
                    </Text>
                  ) : (
                    <View style={styles.toggleContainer}>
                      <Text style={styles.toggleLabel}>
                        {usuario.status === "activo" ? "Activo" : "Inactivo"}
                      </Text>
                      <Switch
                        value={usuario.status === "activo"}
                        onValueChange={() =>
                          toggleEstadoUsuario(
                            usuario.user_id,
                            usuario.status === "activo" ? "inactivo" : "activo"
                          )
                        }
                        trackColor={{ true: "green", false: "red" }}
                        disabled={
                          usuario.category === 1 ||
                          usuario.user_id === userData.id
                        }
                      />
                    </View>
                  )
                ) : usuario.status === "activo" ? (
                  <Text>Activo</Text>
                ) : (
                  <Text>Inactivo</Text>
                )}
              </DataTable.Cell>
              <DataTable.Cell>
                <TouchableOpacity onPress={() => verMasInfoUsuario(usuario)}>
                  <View style={styles.verMasContainer}>
                    <Feather name='plus-circle' size={20} color='#007bff' />
                    <Text style={styles.verMasText}>Ver más</Text>
                  </View>
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>

      <View>
        <Text style={styles.tituloTabla}>Usuarios Inactivos</Text>
        <DataTable style={styles.tabla}>
          <DataTable.Header>
            <DataTable.Title>Nombre</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title>Acciones</DataTable.Title>
          </DataTable.Header>
          {usuariosInactivos.map((usuario) => (
            <DataTable.Row
              key={usuario.user_id}
              style={
                userData &&
                (usuario.category === 1 || usuario.user_id === userData.id)
                  ? styles.filaAdmin
                  : null
              }>
              <DataTable.Cell>
                {usuario.first_name} {usuario.last_name}
              </DataTable.Cell>
              <DataTable.Cell>
                {usuario.user_id !== userData.id ? (
                  usuario.category === 1 ? (
                    <Text>
                      {usuario.status === "activo" ? "Activo" : "Inactivo"}
                    </Text>
                  ) : (
                    <View style={styles.toggleContainer}>
                      <Text style={styles.toggleLabel}>
                        {usuario.status === "activo" ? "Activo" : "Inactivo"}
                      </Text>
                      <Switch
                        value={usuario.status === "activo"}
                        onValueChange={() =>
                          toggleEstadoUsuario(
                            usuario.user_id,
                            usuario.status === "activo" ? "inactivo" : "activo"
                          )
                        }
                        trackColor={{ true: "green", false: "red" }}
                        disabled={
                          usuario.category === 1 ||
                          usuario.user_id === userData.id
                        }
                      />
                    </View>
                  )
                ) : usuario.status === "activo" ? (
                  <Text>Activo</Text>
                ) : (
                  <Text>Inactivo</Text>
                )}
              </DataTable.Cell>
              <DataTable.Cell>
                <TouchableOpacity onPress={() => verMasInfoUsuario(usuario)}>
                  <View style={styles.verMasContainer}>
                    <Feather name='plus-circle' size={20} color='#007bff' />
                  </View>
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Información del Usuario</Text>
            {selectedUser && (
              <View style={styles.userInfoContainer}>
                <Text>ID de Usuario: {selectedUser.user_id}</Text>
                <Text>
                  Nombre: {selectedUser.first_name} {selectedUser.last_name}
                </Text>
                <Text>Email: {selectedUser.email}</Text>
                <Text>Número de Teléfono: {selectedUser.numTel}</Text>
                <Text>
                  Categoría:{" "}
                  {selectedUser.category === 1 ? "Administrador" : "Usuario"}
                </Text>
                <Text>Nickname: {selectedUser.nickname}</Text>
                <Text>Estado: {selectedUser.status}</Text>
                <Text>Fecha de Registro: {selectedUser.fechaRegistro}</Text>
                <Text>
                  Cantidad de Trabajos Asignados:{" "}
                  {selectedUser.cantidadTrabajosAsignados}
                </Text>
                <Text>
                  ID del Departamento del Usuario: {selectedUser.idDepaUsuario}
                </Text>
              </View>
            )}
            <Button title='Cerrar' onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  tituloTabla: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007bff",
  },
  tabla: {
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
  },
  filaAdmin: {
    backgroundColor: "#d3d3d3",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleLabel: {
    marginRight: 8,
  },
  verMasContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  verMasText: {
    marginRight: 5,
    color: "#007bff",
    marginLeft: 5,
  },
  verMasIcon: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007bff",
  },
  userInfoContainer: {
    marginBottom: 10,
  },
  fab: {
    position: "fixed",
    margin: 16,
    right: 0,
    bottom: 16,
    backgroundColor: "#007bff",
    zIndex: 2,
    borderRadius: 30,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    marginBottom: 775,
  },
  backButton: {
    flex: 1,
    padding: 8,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  bottomBar: {
    position: "sticky",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    elevation: 4,
  },
});

export default UsuariosScreen;
