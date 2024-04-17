/** @format */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Picker,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

const FormularioAgregar = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nickname, setNickname] = useState("");
  const [roles, setRoles] = useState([]);
  const [idDepartamento, setIdDepartamento] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    categoria: "",
    nickname: "",
    profilePic: "",
  });

  const validarFormulario = () => {
    let formIsValid = true;
    const newErrors = {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      categoria: "",
      nickname: "",
      profilePic: "",
    };

    // Validar nombre
    if (!nombre) {
      newErrors.nombre = "Por favor ingrese su nombre";
      formIsValid = false;
    }

    // Validar apellido
    if (!apellido) {
      newErrors.apellido = "Por favor ingrese su apellido";
      formIsValid = false;
    }

    // Validar email
    if (!email) {
      newErrors.email = "Por favor ingrese su correo electrónico";
      formIsValid = false;
    } else if (!validarEmail(email)) {
      newErrors.email = "Por favor ingrese un correo electrónico válido";
      formIsValid = false;
    }

    // Validar teléfono
    if (!telefono) {
      newErrors.telefono = "Por favor ingrese su número de teléfono";
      formIsValid = false;
    }

    // Validar categoría
    if (!categoria) {
      newErrors.categoria = "Por favor seleccione una categoría";
      formIsValid = false;
    }

    // Validar nickname
    if (!nickname) {
      newErrors.nickname = "Por favor ingrese su apodo";
      formIsValid = false;
    }

    // Validar imagen de perfil
    if (!profilePic) {
      newErrors.profilePic = "Por favor seleccione una imagen de perfil";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (!formIsValid) {
      setErrorGeneral("Por favor complete todos los campos correctamente");
    } else {
      setErrorGeneral("");
    }

    return formIsValid;
  };

  const handleSubmit = async () => {
    if (validarFormulario()) {
      try {
        const formData = new FormData();
        formData.append("first_name", nombre);
        formData.append("last_name", apellido);
        formData.append("email", email);
        formData.append("password", generarContraseña());
        formData.append("numTel", telefono);
        formData.append("category", categoria);
        formData.append("nickname", nickname);
        formData.append("profile_pic", profilePic);
        formData.append("status", "activo");
        formData.append("idDepaUsuario", idDepartamento);

        const response = await fetch("http://localhost:3000/agregarUsuario", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Usuario agregado exitosamente");
          navigation.navigate("Usuarios");
        } else {
          console.error("Error al agregar el usuario:", response.status);
        }
      } catch (error) {
        console.error("Error al agregar el usuario:", error);
      }
    }
  };

  const generarContraseña = () => {
    const caracteres =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let contraseña = "";
    for (let i = 0; i < 8; i++) {
      contraseña += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    }
    return contraseña;
  };

  const cargarRoles = async () => {
    try {
      const response = await fetch("http://localhost:3000/roles");
      if (response.ok) {
        const data = await response.json();
        setRoles(data.filter((rol) => rol.idRol !== 1));
      } else {
        console.error("Error al cargar los roles:", response.status);
      }
    } catch (error) {
      console.error("Error al cargar los roles:", error);
    }
  };

  const cargarDepartamentos = async () => {
    try {
      const response = await fetch("http://localhost:3000/departamentos");
      if (response.ok) {
        const data = await response.json();
        setDepartamentos(data);
      } else {
        console.error("Error al cargar los departamentos:", response.status);
      }
    } catch (error) {
      console.error("Error al cargar los departamentos:", error);
    }
  };

  useEffect(() => {
    cargarRoles();
    cargarDepartamentos();
  }, []);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const agregarUsuario = async () => {
    try {
      if (!validarEmail(email)) {
        console.error("El email no es válido");
        return;
      } else if (
        !nombre ||
        !apellido ||
        !email ||
        !telefono ||
        !categoria ||
        !nickname ||
        !profilePic
      ) {
        console.error(
          "Por favor complete todos los campos y seleccione una imagen"
        );
        return;
      }

      const formData = new FormData();
      formData.append("first_name", nombre);
      formData.append("last_name", apellido);
      formData.append("email", email);
      formData.append("password", generarContraseña());
      formData.append("numTel", telefono);
      formData.append("category", categoria);
      formData.append("nickname", nickname);
      formData.append("profile_pic", profilePic);
      formData.append("status", "activo");
      formData.append("idDepaUsuario", idDepartamento);

      const response = await fetch("http://localhost:3000/agregarUsuario", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Usuario agregado exitosamente");
        navigation.navigate("Usuarios");
      } else {
        console.error("Error al agregar el usuario:", response.status);
      }
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  const handleProfilePicChange = (event) => {
    const image = event.target.files[0];
    setProfilePic(image);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agregar Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder='Nombre'
        value={nombre}
        onChangeText={(text) => setNombre(text)}
      />
      <TextInput
        style={styles.input}
        placeholder='Apellido'
        value={apellido}
        onChangeText={(text) => setApellido(text)}
      />
      <TextInput
        style={styles.input}
        placeholder='Email'
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder='Teléfono (formato: xxx-xxx-xxxx)'
        value={telefono}
        onChangeText={(text) => {
          if (/^\d{0,3}-?\d{0,3}-?\d{0,4}$/.test(text)) {
            setTelefono(
              text
                .replace(/-/g, "")
                .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
            );
          }
        }}
        keyboardType='phone-pad'
        maxLength={12}
      />
      <Picker
        style={styles.input}
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}>
        <Picker.Item label='Selecciona una categoría' value='' />
        {roles.map((rol) => (
          <Picker.Item
            key={rol.idRol}
            label={rol.nombre}
            value={rol.idRol.toString()}
          />
        ))}
      </Picker>
      <Picker
        style={styles.input}
        selectedValue={idDepartamento}
        onValueChange={(itemValue) => setIdDepartamento(itemValue)}>
        <Picker.Item label='Selecciona un departamento' value='' />
        {departamentos.map((departamento) => (
          <Picker.Item
            key={departamento.idDepartamento}
            label={departamento.nomDepartamento}
            value={departamento.idDepartamento.toString()}
          />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder='Nickname'
        value={nickname}
        onChangeText={(text) => setNickname(text)}
      />
      <input
        type='file'
        accept='image/*'
        onChange={(event) => {
          const file = event.target.files[0];
          if (file) {
            setProfilePic(file);
          }
        }}
      />
      <Button title='Agregar Usuario' onPress={agregarUsuario} />
      <View style={styles.bottomBar}>
        <IconButton
          icon={() => <Feather name='arrow-left' size={24} color='white' />}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
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
});

export default FormularioAgregar;
