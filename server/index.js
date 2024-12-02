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
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
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

// Función para obtener los ejercicios de cardio desde la API de Wger
const getCardioExercises = async () => {
  try {
    const response = await axios.get('https://wger.de/api/v2/exercise', {
      headers: { Authorization: `Token ${process.env.WGER_API_KEY}` },
      params: { language: 2, category: 10, status: 2 }, // Ajustar la categoría según la API
    });
    console.log('Ejercicios de cardio obtenidos:', response.data.results);
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener ejercicios de la API Wger:', error.response?.data || error.message);
    return [];
  }
};

// Función para obtener los datos del usuario
const getUserData = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE usuario_id = ?';
    db.query(query, [userId], (err, result) => {
      if (err || result.length === 0) {
        reject(err || 'Usuario no encontrado');
      } else {
        resolve(result[0]);
      }
    });
  });
};

// Endpoint para obtener ejercicios recomendados de cardio
app.get('/recommended-cardio/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const userData = await getUserData(userId);
    const exercises = await getCardioExercises();
    const filteredExercises = filterExercises(userData, exercises);

    res.status(200).json(filteredExercises);
  } catch (error) {
    console.error('Error al obtener ejercicios recomendados:', error);
    res.status(500).json({ message: 'Error al generar ejercicios recomendados' });
  }
});

// Función para filtrar los ejercicios según los datos del usuario
const filterExercises = (user, exercises) => {
  return exercises.filter(exercise => {
    // Filtrar por nivel de experiencia
    if (user.experiencia === 'Principiante' && exercise.difficulty > 1) {
      return false; // No se recomienda un ejercicio avanzado
    }

    // Filtrar por enfermedades y lesiones
    if (user.enfermedades === 'Hipertension' && exercise.intensity > 7) {
      return false; // No ejercicios de alta intensidad
    }
    if (user.lesiones && exercise.name.includes(user.lesiones)) {
      return false; // Evitar ejercicios que puedan agravar la lesión
    }

    // Filtrar por objetivo (Ejemplo: Si el objetivo es 'Perder Peso', seleccionar ejercicios más exigentes)
    if (user.objetivo === 'Perder Peso' && exercise.calories_burned < 200) {
      return false; // Ejercicios que no queman suficientes calorías
    }

    // Filtrar por disponibilidad (El ejercicio no debe exceder el tiempo disponible)
    if (user.disponibilidad < exercise.duration) {
      return false; // El ejercicio dura más de lo que el usuario puede entrenar
    }

    return true; // El ejercicio pasa todos los filtros
  });
};
// Endpoint para obtener la rutina diaria del usuario
app.post('/daily-routines', (req, res) => {
  const { usuario_id, ejercicio, fecha } = req.body;
  const query = `
    INSERT INTO daily_routines (usuario_id, fecha, ejercicios)
    VALUES (?, ?, JSON_ARRAY(?))
    ON DUPLICATE KEY UPDATE ejercicios = JSON_ARRAY_APPEND(ejercicios, '$', ?)
  `;

  db.query(query, [usuario_id, fecha, ejercicio, ejercicio], (err) => {
    if (err) {
      console.error('Error al guardar la rutina diaria:', err);
      return res.status(500).json({ message: 'Error al guardar la rutina diaria' });
    }
    res.status(200).json({ message: 'Ejercicio agregado a la rutina diaria' });
  });
});
// Función para obtener ejercicios en casa desde la API de Wger
const getHomeExercises = async () => {
  try {
    const response = await axios.get('https://wger.de/api/v2/exercise', {
      headers: { Authorization: `Token ${process.env.WGER_API_KEY}` },
      params: { language: 2, category: 8, status: 2 }, // Ajustar la categoría según la API
    });
    console.log('Ejercicios en casa obtenidos:', response.data.results);
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener ejercicios en casa de la API Wger:', error.response?.data || error.message);
    return [];
  }
};

// Endpoint para obtener ejercicios recomendados en casa
app.post('/recommended-home/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { tipoEntrenamiento } = req.body; // 'fullbody', 'trenSuperior', 'trenInferior', o 'especifico'
  try {
    const userData = await getUserData(userId);
    const exercises = await getHomeExercises();

    // Filtrar ejercicios basados en tipo de entrenamiento
    const filteredExercises = exercises.filter((exercise) => {
      if (tipoEntrenamiento === 'fullbody') return true; // Todos los ejercicios son válidos
      if (tipoEntrenamiento === 'trenSuperior') return exercise.name.toLowerCase().includes('upper');
      if (tipoEntrenamiento === 'trenInferior') return exercise.name.toLowerCase().includes('lower');
      if (
        tipoEntrenamiento === 'especifico' &&
        (userData.experiencia === 'Intermedio' || userData.experiencia === 'Avanzado')
      ) {
        return true; // Permitir ejercicios específicos solo para niveles más altos
      }
      return false;
    });

    // Aplicar filtros adicionales según el perfil del usuario
    const finalExercises = filterExercises(userData, filteredExercises);

    res.status(200).json(finalExercises);
  } catch (error) {
    console.error('Error al obtener ejercicios recomendados en casa:', error);
    res.status(500).json({ message: 'Error al generar ejercicios recomendados en casa' });
  }
});
// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log('Servidor ejecutándose en http://0.0.0.0:${port}');
});