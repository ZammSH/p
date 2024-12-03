const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Validar configuración de entorno
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE || !process.env.WGER_API_KEY) {
  console.error('Faltan configuraciones en el archivo .env');
  process.exit(1);
}

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 41782, // Usa el puerto correcto según tu configuración de Railway
  connectTimeout: 12000, // Tiempo de espera en milisegundos
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Salir del proceso si hay error
  }
  console.log('Conexión a la base de datos exitosa');
});



// Rutas
app.get('/', (req, res) => {
  res.send('¡Servidor backend funcionando!');
});

// Registro de usuario
app.post('/register', (req, res) => {
  const { nombre, apellido, correo, contraseña, peso, estatura, enfermedades, lesiones, experiencia, equipo, objetivo, disponibilidad } = req.body;
  console.log('Datos recibidos para registro:', req.body);
  const checkEmailQuery = 'SELECT * FROM users WHERE correo = ?';
  db.query(checkEmailQuery, [correo], (err, result) => {
    if (err) {
      console.error('Error al verificar el correo:', err);
      return res.status(500).json({ message: 'Error interno' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const insertUserQuery = `
    INSERT INTO users (nombre, apellido, correo, contraseña, peso, estatura, enfermedades, lesiones, experiencia, equipo, objetivo, disponibilidad)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    db.query(insertUserQuery, [nombre, apellido, correo, contraseña, peso, estatura, enfermedades, lesiones, experiencia, equipo, objetivo, disponibilidad], (err) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ message: 'Error interno' });
      }
      res.status(200).json({ message: 'Usuario registrado con éxito' });
    });
  });
});

// Login de usuario
app.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  const query = 'SELECT * FROM users WHERE correo = ?';
  db.query(query, [correo], (err, result) => {
    if (err) {
      console.error('Error al verificar el correo:', err);
      return res.status(500).json({ message: 'Error interno' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Correo no encontrado' });
    }

    const user = result[0];
    if (contraseña !== user.contraseña) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      user: { usuario_id: user.usuario_id, nombre: user.nombre, correo: user.correo },
    });
  });
});
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM users WHERE usuario_id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error al obtener los datos del usuario:', err);
      return res.status(500).json({ message: 'Error interno' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = result[0];
    res.status(200).json({
      usuario_id: user.usuario_id,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      peso: user.peso,
      estatura: user.estatura,
      enfermedades: user.enfermedades,
      lesiones: user.lesiones,
      experiencia: user.experiencia,
      equipo: user.equipo,
      objetivo: user.objetivo,
      disponibilidad: user.disponibilidad,
    });
  });
});
app.put('/user/:id', (req, res) => {
  const userId = req.params.id;
  const {
    nombre,
    apellido,
    correo,
    peso,
    estatura,
    enfermedades,
    lesiones,
    experiencia,
    equipo,
    objetivo,
    disponibilidad,
  } = req.body;

  const values = [
    nombre,
    apellido,
    correo,
    peso,
    estatura,
    enfermedades,
    lesiones,
    experiencia,
    equipo,
    objetivo,
    disponibilidad,
    userId, // El último parámetro es el ID del usuario
  ];

  const updateUserQuery = `
    UPDATE users
    SET
      nombre = ?, 
      apellido = ?, 
      correo = ?, 
      peso = ?, 
      estatura = ?, 
      enfermedades = ?, 
      lesiones = ?, 
      experiencia = ?, 
      equipo = ?, 
      objetivo = ?, 
      disponibilidad = ?
    WHERE usuario_id = ?
  `;

  db.query(updateUserQuery, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).json({ message: 'Error interno al actualizar el usuario' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario actualizado con éxito' });
  });
});
;

// Función para obtener datos del usuario
const getUserData = async (userId) => {
  try {
    const query = 'SELECT * FROM users WHERE usuario_id = ?';
    const [rows] = await db.promise().query(query, [userId]);
    console.log('Datos del usuario:', rows);

    if (rows.length === 0) {
      throw new Error('Usuario con id ${userId} no encontrado');
    }

    const user = rows[0];
    return {
      id: user.usuario_id,
      experiencia: user.experiencia || 'Principiante',
      disponibilidad: user.disponibilidad || 30,
      equipo: user.equipo ? JSON.parse(user.equipo) : [],
      enfermedades: user.enfermedades ? JSON.parse(user.enfermedades) : [],
      lesiones: user.lesiones ? JSON.parse(user.lesiones) : [],
    };
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error.message);
    throw new Error('Error al obtener datos del usuario');
  }
};

app.get('/exercises/:category', async (req, res) => {
  const { category } = req.params;
  const { userId } = req.query;

  try {
    let query = 'SELECT * FROM exercises WHERE category = ?';
    const params = [category];

    if (userId) {
      const userData = await getUserData(userId);
      query += `
        AND duration <= ?
        AND NOT JSON_OVERLAPS(restrictions, ?)
      `;
      params.push(userData.disponibilidad, JSON.stringify([...userData.enfermedades, ...userData.lesiones]));
    }

    const [exercises] = await db.promise().query(query, params);
    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error al obtener ejercicios:', error);
    res.status(500).json({ message: 'Error al obtener ejercicios.' });
  }
});



// Función para filtrar ejercicios
const filterExercises = (exercises, userData) => {
  return exercises.filter(exercise => {
    // Filtrar por duración
    if (exercise.duration > userData.disponibilidad) return false;

    // Verificar equipo necesario
    if (exercise.equipment && exercise.equipment.length > 0) {
      const equipmentRequired = JSON.parse(exercise.equipment);
      if (!equipmentRequired.every(eq => userData.equipo.includes(eq))) return false;
    }

    // Filtrar por restricciones de enfermedades
    if (userData.enfermedades.some(disease => JSON.parse(exercise.restrictions).includes(disease))) return false;

    // Filtrar por restricciones de lesiones
    if (userData.lesiones.some(injury => JSON.parse(exercise.restrictions).includes(injury))) return false;

    return true;
  });
};



// Endpoints
// Ruta para obtener ejercicios recomendados por categoría
app.post('/recommendations', async (req, res) => {
  try {
    const { category, tiempo = 30, enfermedades = [], lesiones = [] } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: 'La categoría es obligatoria.' });
    }

    const restrictions = JSON.stringify([...enfermedades, ...lesiones]);
    const query = `
      SELECT *
      FROM exercises
      WHERE category = ?
        AND duration <= ?
        AND NOT JSON_OVERLAPS(restrictions, ?)
    `;

    const [rows] = await db.promise().query(query, [category, tiempo, restrictions]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No se encontraron ejercicios para esta categoría.',
      });
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener ejercicios:', error.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});


// Ruta para registrar ejercicios en la rutina diaria
app.post('/add-to-routine', async (req, res) => {
  const { user_id, exercise_id, fecha } = req.body;

  try {
    const query = `
      INSERT INTO daily_routines (usuario_id, fecha, ejercicios)
      VALUES (?, ?, JSON_ARRAY(?))
      ON DUPLICATE KEY UPDATE
        ejercicios = IF(
          JSON_CONTAINS(ejercicios, JSON_ARRAY(?)),
          ejercicios,
          JSON_ARRAY_APPEND(ejercicios, '$', ?)
        )
    `;

    await db.promise().query(query, [user_id, fecha, exercise_id, exercise_id, exercise_id]);

    res.status(200).json({
      success: true,
      message: 'Ejercicio agregado a la rutina diaria.',
    });
  } catch (error) {
    console.error('Error al agregar ejercicio a la rutina:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar ejercicio a la rutina.',
    });
  }
});
// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log('Servidor ejecutándose en http://0.0.0.0:${port}');
});