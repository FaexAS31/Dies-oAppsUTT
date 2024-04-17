/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");

const app = express();
const port = 3000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    cb(null, `profile_${Date.now()}.${file.originalname.split(".").pop()}`);
  },
});
const upload = multer({ dest: "backend/images/" });

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// const connection = mysql.createConnection({
//   host: "193.203.166.175",
//   user: "u865220554_root",
//   password: "@P!ZZa/01245",
//   database: "u865220554_request",
// });
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "requests",
});

connection.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err);
    return;
  }
  console.log("Conexión a la base de datos MySQL establecida");
});

app.get("/checkdb", (req, res) => {
  connection.query("SELECT 1", (err, results) => {
    if (err) {
      console.error("Error al verificar la conexión a la base de datos:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
    res.json({ message: "Conexión a la base de datos exitosa" });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM usuarios WHERE nickname = ? AND password = ?";

  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const user = results[0];
    if (user.category.toString() !== "3") {
      res.status(403).json({ error: "Nivel de acceso no suficiente" });
      return;
    }

    res.json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        userCategory: user.category,
        nickName: user.nickname,
        idDepaUsuario: user.idDepaUsuario,
        profilePic: user.profile_pic,
      },
    });
  });
});
app.get("/aprobadas", (req, res) => {
  const sqlQuery = `
  SELECT s.idSolicitud, s.fechaSolicitud, s.estadoSolicitud, s.justificacion, s.comentario, 
         s.cantidad, CONCAT(u.first_name, ' ', u.last_name) AS nombreUsuario, 
         p.nomProducto AS nombreProducto, pr.nombre AS prioridad, s.estadoEntrega 
  FROM solicitudes s
  INNER JOIN usuarios u ON s.idSolicitudUser = u.user_id
  INNER JOIN productos p ON s.idSolicitudProducto = p.idProducto
  INNER JOIN prioridades pr ON s.idPrioridad = pr.idPrioridad
  WHERE s.estadoSolicitud = 'Autorizado'
  ORDER BY s.idSolicitud ASC;`;

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al obtener las solicitudes aprobadas" });
      return;
    }

    res.json(results);
  });
});

app.get("/desaprobadas", (req, res) => {
  const sqlQuery = `
  SELECT s.idSolicitud, s.fechaSolicitud, s.estadoSolicitud, s.justificacion, s.comentario, 
         s.cantidad, CONCAT(u.first_name, ' ', u.last_name) AS nombreUsuario, 
         p.nomProducto AS nombreProducto, pr.nombre AS prioridad, s.estadoEntrega 
  FROM solicitudes s
  INNER JOIN usuarios u ON s.idSolicitudUser = u.user_id
  INNER JOIN productos p ON s.idSolicitudProducto = p.idProducto
  INNER JOIN prioridades pr ON s.idPrioridad = pr.idPrioridad
  WHERE s.estadoSolicitud = 'Denegado'
  ORDER BY s.idSolicitud ASC;`;

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al obtener las solicitudes desaprobadas" });
      return;
    }

    res.json(results);
  });
});

app.get("/pendientes", (req, res) => {
  const sqlQuery = `
    SELECT s.idSolicitud, s.fechaSolicitud, s.estadoSolicitud, s.justificacion, s.comentario, 
           s.cantidad, CONCAT(u.first_name, ' ', u.last_name) AS nombreUsuario, 
           p.nomProducto AS nombreProducto, pr.nombre AS prioridad, s.estadoEntrega 
    FROM solicitudes s
    INNER JOIN usuarios u ON s.idSolicitudUser = u.user_id
    INNER JOIN productos p ON s.idSolicitudProducto = p.idProducto
    INNER JOIN prioridades pr ON s.idPrioridad = pr.idPrioridad
    WHERE s.estadoSolicitud = 'Pendiente'
    ORDER BY s.idSolicitud ASC;`;

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al obtener las solicitudes pendientes" });
      return;
    }
    const totalPendientes = results.length;

    res.json({ pendientes: results, totalPendientes });
  });
});
app.get("/pendientes1", (req, res) => {
  const sqlQuery = `
    SELECT s.idSolicitud, s.fechaSolicitud, s.estadoSolicitud, s.justificacion, s.comentario, 
           s.cantidad, CONCAT(u.first_name, ' ', u.last_name) AS nombreUsuario, 
           p.nomProducto AS nombreProducto, pr.nombre AS prioridad, s.estadoEntrega 
    FROM solicitudes s
    INNER JOIN usuarios u ON s.idSolicitudUser = u.user_id
    INNER JOIN productos p ON s.idSolicitudProducto = p.idProducto
    INNER JOIN prioridades pr ON s.idPrioridad = pr.idPrioridad
    WHERE s.estadoSolicitud = 'Pendiente'
    ORDER BY s.idSolicitud ASC;`;

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al obtener las solicitudes pendientes" });
      return;
    }

    res.json(results);
  });
});
app.post("/aprobar/:idSolicitud", (req, res) => {
  const { idSolicitud } = req.params;

  const sqlQuery = `
    UPDATE solicitudes 
    SET estadoSolicitud = 'Autorizado' 
    WHERE idSolicitud = ?;
  `;

  connection.query(sqlQuery, [idSolicitud], (err, results) => {
    if (err) {
      console.error("Error al actualizar el estado de la solicitud:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    res.json({ message: "Solicitud aprobada exitosamente" });
  });
});

app.post("/desaprobar/:idSolicitud", (req, res) => {
  const { idSolicitud } = req.params;

  const sqlQuery = `
    UPDATE solicitudes 
    SET estadoSolicitud = 'Denegado' 
    WHERE idSolicitud = ?;
  `;

  connection.query(sqlQuery, [idSolicitud], (err, results) => {
    if (err) {
      console.error("Error al actualizar el estado de la solicitud:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    res.json({ message: "Solicitud desaprobada exitosamente" });
  });
});
app.get("/usuarios/activos", (req, res) => {
  const sqlQuery = `
    SELECT * FROM usuarios 
    WHERE status = 'activo'
        ORDER BY category ASC;
;
  `;

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios activos:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    res.json(results);
  });
});

app.get("/usuarios/inactivos", (req, res) => {
  const sqlQuery = `
    SELECT * FROM usuarios 
    WHERE status = 'inactivo'
        ORDER BY category ASC;
;
  `;

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios inactivos:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    res.json(results);
  });
});
app.put("/usuarios/:idUsuario", (req, res) => {
  const { idUsuario } = req.params;
  const { status } = req.body;

  const sqlQuery = `
    UPDATE usuarios
    SET status = ?
    WHERE user_id = ?;
  `;

  connection.query(sqlQuery, [status, idUsuario], (err, results) => {
    if (err) {
      console.error("Error al actualizar el estado del usuario:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    res.json({ message: "Estado del usuario actualizado exitosamente" });
  });
});
app.post("/agregarUsuario", upload.single("profile_pic"), (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    numTel,
    category,
    nickname,
    status,
    idDepaUsuario,
  } = req.body;

  if (!email || !email.includes("@")) {
    return res
      .status(400)
      .json({ error: "El email proporcionado no es válido" });
  }

  const generatedPassword = password || Math.random().toString(36).slice(-8);

  const fechaRegistro = new Date().toISOString().slice(0, 19).replace("T", " ");

  const cantidadTrabajosAsignados = 0;

  const profile_pic = req.file ? req.file.filename : null;

  const sqlQuery = `
    INSERT INTO usuarios (first_name, last_name, email, password, numTel, category, nickname, profile_pic, status, fechaRegistro, cantidadTrabajosAsignados, idDepaUsuario)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  connection.query(
    sqlQuery,
    [
      first_name,
      last_name,
      email,
      generatedPassword,
      numTel,
      category,
      nickname,
      profile_pic,
      status,
      fechaRegistro,
      cantidadTrabajosAsignados,
      idDepaUsuario,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al agregar el nuevo usuario:", err);
        res.status(500).json({
          error: "Error interno del servidor al agregar el nuevo usuario",
        });
        return;
      }

      res.json({ message: "Usuario agregado exitosamente" });
    }
  );
});

app.get("/roles", (req, res) => {
  const sqlQuery = `
    SELECT * FROM roles;
;
  `;

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios inactivos:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    res.json(results);
  });
});
app.get("/departamentos", (req, res) => {
  const sqlQuery = `
    SELECT * FROM departamentos;
;
  `;

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios inactivos:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
