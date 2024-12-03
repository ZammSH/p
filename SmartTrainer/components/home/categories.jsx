
import React, { useState, useEffect } from "react";

import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

const categories = [
  { id: '1', title: 'Cardio', icon: '🏃' },
  { id: '2', title: 'Gimnasio', icon: '🏋️' },
  { id: '3', title: 'Ejercicio en Casa', icon: '🏠' },
  { id: '4', title: 'Calistenia', icon: '🤸' },
];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [userId] = useState(1); // ID del usuario. Cambiar según sea necesario.
  const [filters, setFilters] = useState({});
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [dailyRoutine, setDailyRoutine] = useState([]);

  // Función para obtener ejercicios desde el backend
  const fetchExercises = async (type) => {
    try {
      let endpoint = `/recommended-${type}/${userId}`;
      let options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };

      if (type === "gym" && filters.tipoEntrenamiento) {
        options.body = JSON.stringify(filters);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();

      console.log("Datos obtenidos del backend:", data); // Depuración

      if (data.exercises && data.exercises.length > 0) {
        setExercises(data.exercises);
      } else {
        setExercises([]);
      }
    } catch (error) {
      console.error(`Error al obtener ejercicios de ${type}:`, error.message);
      setExercises([]);
    }
  };

  // Agregar un ejercicio a la rutina diaria
  const addToRoutine = (exercise) => {
    setDailyRoutine([...dailyRoutine, exercise]);
    setSelectedExercise(null);
    setSelectedCategory(null);
  };

  return (
    <div>
      <h1>Gestión de Rutinas de Ejercicio</h1>
      {/* Botones de Categorías */}
      <div>
        <button onClick={() => { setSelectedCategory("cardio"); fetchExercises("cardio"); }}>
          Cardio
        </button>
        <button onClick={() => { setSelectedCategory("gym"); fetchExercises("gym"); }}>
          Gimnasio
        </button>
        <button onClick={() => { setSelectedCategory("home"); fetchExercises("home"); }}>
          Ejercicio en Casa
        </button>
        <button onClick={() => { setSelectedCategory("calistenia"); fetchExercises("calistenia"); }}>
          Calistenia
        </button>
      </div>

      {/* Modal para Mostrar Ejercicios */}
      {selectedCategory && (
        <div>
          <h2>Recomendaciones de {selectedCategory}</h2>
          {selectedExercise ? (
            <div>
              <h3>{selectedExercise.name}</h3>
              <p>{selectedExercise.description}</p>
              <button onClick={() => addToRoutine(selectedExercise)}>Agregar a la rutina</button>
              <button onClick={() => setSelectedExercise(null)}>Regresar</button>
            </div>
          ) : (
            <ul>
              {exercises.length > 0 ? (
                exercises.map((exercise) => (
                  <li key={exercise.id}>
                    <span onClick={() => setSelectedExercise(exercise)}>{exercise.name}</span>
                  </li>
                ))
              ) : (
                <p>No se encontraron ejercicios para esta categoría.</p>
              )}
            </ul>
          )}
          <button onClick={() => setSelectedCategory(null)}>Cerrar</button>
        </div>
      )}

      {/* Rutina Diaria */}
      <div>
        <h2>Rutina Diaria</h2>
        <ul>
          {dailyRoutine.map((exercise, index) => (
            <li key={index}>
              <strong>{exercise.name}</strong>
              <p>{exercise.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  routineContainer: {
    marginTop: 20,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  listContainer: {
    marginBottom: 20,
  },
  exerciseCard: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  trainingOption: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  trainingOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  exerciseItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  noExercises: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
    body: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5",
      margin: "0",
      padding: "20px",
    },
    button: {
      margin: "10px",
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#ddd",
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
    },  
});
