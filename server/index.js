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

// Generar rutina personalizada
app.post('/generate-routine', async (req, res) => {
  const { usuarioId } = req.body;

  try {
    const userQuery = 'SELECT * FROM users WHERE usuario_id = ?';
    db.query(userQuery, [usuarioId], async (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const user = result[0];
      const apiKey = process.env.WGER_API_KEY;
      const params = {
        language: 2,
        status: 2,
        ...(user.equipo && { equipment: user.equipo.split(',').map((e) => e.trim()) }),
      };

      const response = await axios.get('https://wger.de/api/v2/exercise', {
        headers: { Authorization: `Token ${apiKey}` },
        params,
      });

      const exercises = response.data.results.slice(0, Math.floor(user.disponibilidad / 5));
      const routine = exercises.map((exercise) => ({
        name: exercise.name,
        description: exercise.description || '',
      }));

      saveRoutine(user.usuario_id, routine);
      res.status(200).json({ routine });
    });
  } catch (error) {
    console.error('Error al generar rutina:', error);
    res.status(500).json({ message: 'Error al generar rutina' });
  }
});

// Guardar rutina en la base de datos
const saveRoutine = (usuarioId, routine) => {
  const query = 'INSERT INTO routines (usuario_id, ejercicio, descripcion) VALUES ?';
  const values = routine.map((e) => [usuarioId, e.name, e.description]);
  db.query(query, [values], (err) => {
    if (err) {
      console.error('Error al guardar rutina:', err);
    }
  });
};

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en http://0.0.0.0:${port}`);
});
