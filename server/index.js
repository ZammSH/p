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
  connectTimeout: 8000, // Tiempo de espera en milisegundos
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
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
//obtener datos
const getUserData = async (userId) => {
  try {
    const query = 'SELECT * FROM users WHERE usuario_id = ?';

    const [rows] = await db.promise().query(query, [userId]);
    console.log("Datos obtenidos del usuario desde la base de datos:", rows); // 4. Verifica los datos del usuario

    if (rows.length === 0) {
      throw new Error(`Usuario con id ${userId} no encontrado`);
    }

    const user = rows[0];

    return {
      id: user.usuario_id,
      experiencia: user.experiencia || 'Principiante', // Principiante, Intermedio, Avanzado
      disponibilidad: user.disponibilidad || 30, // Tiempo disponible en minutos
      equipo: user.equipo ? user.equipo.split(',') : [], // Equipamiento disponible
      enfermedades: user.enfermedades ? user.enfermedades.split(',') : [], // Enfermedades
      lesiones: user.lesiones ? user.lesiones.split(',') : [], // Lesiones
    };
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error.message);
    throw new Error('Error al obtener datos del usuario');
  }
};

// Función genérica para filtrar ejercicios
const filterExercises = (exercises, userData, options = {}) => {
  const { tipoEntrenamiento, musculoEspecifico } = options;

  console.log("Ejercicios antes del filtrado:", exercises); // 6. Verifica los ejercicios antes del filtro
  console.log("Datos del usuario para el filtrado:", userData); // 7. Verifica los datos del usuario

  const filtered = exercises.filter((exercise) => {
    // (Aplica las condiciones de filtrado aquí)
    return true; // Pasa el filtro
  });

  console.log("Ejercicios después del filtrado:", filtered); // 8. Verifica los ejercicios que pasaron el filtro
  return filtered;
};

// Función para obtener ejercicios de Wger API
const getExercisesFromAPI = async (category) => {
  try {
    const response = await axios.get('https://wger.de/api/v2/exercise', {
      headers: { Authorization: `Token ${process.env.WGER_API_KEY}` },
      params: { language: 2, status: 2, category },
    });
    console.log("Datos obtenidos de la API Wger:", response.data.results); // 5. Verifica los datos devueltos por la API
    return response.data.results.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description || 'Sin descripción',
      equipment: exercise.equipment || [],
    }));
  } catch (error) {
    console.error(`Error al obtener ejercicios de Wger API:`, error.message);
    return [];
  }
};

// Endpoints
app.post('/recommended-cardio/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const userData = await getUserData(userId);
    console.log("Datos del usuario:", userData); // 1. Verifica los datos del usuario

    const exercises = await getExercisesFromAPI(10); // Cambiar categoría según Wger
    console.log("Ejercicios obtenidos de la API:", exercises); // 2. Verifica los datos de la API

    const filteredExercises = filterExercises(exercises, userData);
    console.log("Ejercicios filtrados:", filteredExercises); // 3. Verifica los ejercicios después del filtrado

    res.status(200).json({ exercises: filteredExercises });
  } catch (error) {
    console.error('Error al generar ejercicios de cardio:', error.message);
    res.status(500).json({ message: 'Error al generar ejercicios de cardio' });
  }
});

app.post('/recommended-gym/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { tipoEntrenamiento, musculoEspecifico } = req.body;
  try {
    const userData = await getUserData(userId);
    const exercises = await getExercisesFromAPI(8); // Categoría de gimnasio
    const filteredExercises = filterExercises(exercises, userData, {
      tipoEntrenamiento,
      musculoEspecifico,
    });
    res.status(200).json({ exercises: filteredExercises });
  } catch (error) {
    console.error('Error al generar ejercicios de gimnasio:', error.message);
    res.status(500).json({ message: 'Error al generar ejercicios de gimnasio' });
  }
});

app.post('/recommended-home/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const userData = await getUserData(userId);
    const exercises = await getExercisesFromAPI(9); // Categoría de ejercicios en casa
    const filteredExercises = filterExercises(exercises, userData);
    res.status(200).json({ exercises: filteredExercises });
  } catch (error) {
    console.error('Error al generar ejercicios en casa:', error.message);
    res.status(500).json({ message: 'Error al generar ejercicios en casa' });
  }
});

app.post('/recommended-calistenia/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const userData = await getUserData(userId);
    const exercises = await getExercisesFromAPI(7); // Categoría de calistenia
    const filteredExercises = filterExercises(exercises, userData);
    res.status(200).json({ exercises: filteredExercises });
  } catch (error) {
    console.error('Error al generar ejercicios de calistenia:', error.message);
    res.status(500).json({ message: 'Error al generar ejercicios de calistenia' });
  }
});



// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log('Servidor ejecutándose en http://0.0.0.0:${port}');
});