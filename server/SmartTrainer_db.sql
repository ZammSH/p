CREATE DATABASE IF NOT EXISTS SmartTrainer_db;
USE SmartTrainer_db;

CREATE TABLE IF NOT EXISTS users (
  usuario_id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  correo VARCHAR(50) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  peso FLOAT NOT NULL,
  estatura FLOAT NOT NULL,
  enfermedades ENUM('Ninguna', 'Diabetes', 'Hipertension', 'Asma', 'Otra'),
  lesiones VARCHAR(300),
  experiencia ENUM('Principiante', 'Intermedio', 'Avanzado') NOT NULL DEFAULT 'Principiante',
  equipo VARCHAR(255) DEFAULT NULL,
  objetivo ENUM('Perder Peso', 'Ganancia muscular', 'Mantenimiento') DEFAULT 'Mantenimiento',
  disponibilidad INT DEFAULT 30 -- Minutos disponibles al día
);

CREATE TABLE IF NOT EXISTS routines (
  rutina_id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  ejercicio VARCHAR(255),
  descripcion TEXT,
 fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES users(usuario_id)
);




