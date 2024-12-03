import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';
import axios from 'axios';

const Categories = () => {
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  const [dailyRoutine, setDailyRoutine] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseDetailsModal, setExerciseDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchExercises = async (category) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/recommendations', {
        category: category,
        tiempo: 30,
        enfermedades: ['asma'],
        lesiones: ['rodilla'],
      });

      if (response.data.success) {
        setRecommendedExercises(response.data.data);
        setModalVisible(true);
      } else {
        setRecommendedExercises([]);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToDailyRoutine = (exercise) => {
    if (!dailyRoutine.some((e) => e.exercise_id === exercise.exercise_id)) {
      setDailyRoutine((prevRoutine) => [...prevRoutine, exercise]);
    }
    setModalVisible(false);
  };

  const showExerciseDetails = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseDetailsModal(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      <View style={styles.buttonContainer}>
        {['Cardio', 'Calistenia', 'Gimnasio', 'Ejercicio en casa'].map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.button}
            onPress={() => fetchExercises(category.toLowerCase())}
          >
            <Text style={styles.buttonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Rutina del día</Text>
      {dailyRoutine.length > 0 ? (
        <FlatList
          data={dailyRoutine}
          keyExtractor={(item) => item.exercise_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.routineItem}
              onPress={() => showExerciseDetails(item)}
            >
              <Text style={styles.routineText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No hay ejercicios en la rutina.</Text>
      )}

      {/* Modal para elegir ejercicios */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecciona un ejercicio</Text>
          {loading ? (
            <Text style={styles.loadingText}>Cargando...</Text>
          ) : (
            <FlatList
              data={recommendedExercises}
              keyExtractor={(item) => item.exercise_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.exerciseItem}
                  onPress={() => addToDailyRoutine(item)}
                >
                  <Text style={styles.exerciseName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal para ver detalles del ejercicio */}
      <Modal
        visible={exerciseDetailsModal}
        animationType="fade"
        onRequestClose={() => setExerciseDetailsModal(false)}
      >
        <View style={styles.modalContainer}>
          {selectedExercise && (
            <>
              <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
              <Text>{selectedExercise.description}</Text>
              <Text>Duración: {selectedExercise.duration} minutos</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setExerciseDetailsModal(false)}
              >
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  routineItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    elevation: 2,
  },
  routineText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  exerciseItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#FF5252',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default Categories;