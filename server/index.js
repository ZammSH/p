const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Asegúrate de importar axios
require('dotenv').config(); // Carga las variables de entorno desde .env

const app = express();
const port = process.env.PORT || 3000;
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('WGER_API_KEY:', process.env.WGER_API_KEY);

// Validar variables de entorno necesarias
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
  console.error('Faltan configuraciones en el archivo .env. Verifica DB_HOST, DB_USER, DB_PASSWORD y DB_DATABASE.');
  process.exit(1);
}

if (!process.env.WGER_API_KEY) {
  console.error('Falta la clave WGER_API_KEY en el archivo .env');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Crear la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});


// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Servidor backend funcionando!');
});

// Endpoint para el registro de usuario
app.post('/register', (req, res) => {
  const { nombre, apellido, correo, contraseña, peso, estatura, enfermedades, lesiones } = req.body;

  const enfermedadesValidas = ['Ninguna', 'Diabetes', 'Hipertension', 'Asma', 'Otra'];

  if (!enfermedadesValidas.includes(enfermedades)) {
    return res.status(400).json({ error: 'Valor inválido para enfermedades' });
  }

  const checkEmailQuery = 'SELECT * FROM users WHERE correo = ?';
  db.query(checkEmailQuery, [correo], (err, result) => {
    if (err) {
      console.error('Error al verificar el correo:', err);
      return res.status(500).json({ message: 'Error al verificar el correo' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Insertar el nuevo usuario en la base de datos
    const query = `
      INSERT INTO users (nombre, apellido, correo, contraseña, peso, estatura, enfermedades, lesiones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre, apellido, correo, contraseña, peso, estatura, enfermedades, lesiones], (err) => {
      if (err) {
        console.error('Error al insertar usuario:', err);
        return res.status(500).json({ message: 'Error al registrar usuario' });
      }

      console.log('Usuario registrado con éxito');
      res.status(200).json({ message: 'Usuario registrado con éxito' });
    });
  });
});

// Endpoint para el login
app.post('/login', (req, res) => {
  console.log('Datos recibidos:', req.body);

  const { correo, contraseña } = req.body;

  const query = 'SELECT * FROM users WHERE correo = ?';
  db.query(query, [correo], (err, result) => {
    if (err) {
      console.error('Error al verificar el correo:', err);
      return res.status(500).json({ message: 'Error al verificar el correo' });
    }

    if (result.length === 0) {
      console.log('Correo no encontrado');
      return res.status(400).json({ success: false, message: 'Correo no encontrado' });
    }

    const user = result[0];
    if (contraseña !== user.contraseña) {
      console.log('Contraseña incorrecta');
      return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
    }

    console.log('Login exitoso');
    res.status(200).json({ success: true, message: 'Login exitoso', user: { nombre: user.nombre, correo: user.correo } });
  });
});

const translateText = async (text, targetLang = 'es') => {
  if (!text || text.trim() === '') {
    console.error('Texto vacío o inválido para traducir:', text);
    return text;
  }

  try {
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: `en|${targetLang}`,
      },
    });

    return response.data.responseData.translatedText;
  } catch (error) {
    console.error('Error al traducir con MyMemory:', error.message, 'Texto:', text);
    return text;
  }
};


app.post('/generate-routine', async (req, res) => {
  const { usuarioId } = req.body;

  try {
    // Obtener la información del usuario
    const query = 'SELECT * FROM users WHERE usuario_id = ?';
    db.query(query, [usuarioId], async (err, result) => {
      if (err || result.length === 0) {
        return res.status(500).json({ message: 'Error al obtener datos del usuario' });
      }

      const user = result[0];

      // Obtener ejercicios de la API de Wger
      const apiKey = process.env.WGER_API_KEY;
      const response = await axios.get('https://wger.de/api/v2/exercise', {
        headers: { Authorization: `Token ${apiKey}` },
      });

      const exercises = response.data.results.slice(0, 5); // Selecciona los primeros 5 ejercicios

      // Traducir los nombres y descripciones
      const routine = await Promise.all(
        exercises.map(async (exercise) => ({
          name: await translateText(exercise.name, 'es'),
          description: await translateText(exercise.description || '', 'es'),
        }))
      );

      res.status(200).json({ routine }); // Enviar la rutina traducida
    });
  } catch (error) {
    console.error('Error al generar rutina:', error);
    res.status(500).json({ message: 'Error al generar rutina' });
  }
});



app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor backend ejecutándose en http://0.0.0.0:${port}`);
});
