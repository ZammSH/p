import React, { useState } from 'react';
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

export default function Categories() {
  const userExperience = 'Principiante'; // Cambia esto dinámicamente según el usuario
  const [routines, setRoutines] = useState({
    cardio: [],
    gym: [],
    home: [],
    calisthenics: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [trainingTypeModalVisible, setTrainingTypeModalVisible] = useState(false);
  const [trainingType, setTrainingType] = useState(null);
  const [muscleGroup, setMuscleGroup] = useState(null);
  const [muscleGroupModalVisible, setMuscleGroupModalVisible] = useState(false);

  const fetchRecommendedExercises = async (category) => {
    setLoading(true);
    try {
      const endpoint =
        category === 'Cardio'
          ? 'http://localhost:3000/recommended-cardio/1'
          : category === 'Gimnasio'
          ? 'http://localhost:3000/recommended-gym/1'
          : category === 'Ejercicio en Casa'
          ? 'http://localhost:3000/recommended-home/1'
          : 'http://localhost:3000/recommended-calisthenics/1';

      const response = await fetch(endpoint);
      const data = await response.json();
      if (response.ok) {
        setRecommendedExercises(data);
        setSelectedExercise(null);
        setModalVisible(true);
        setCurrentCategory(category.toLowerCase());
      } else {
        Alert.alert('Error', 'No se pudieron obtener ejercicios recomendados.');
      }
    } catch (error) {
      console.error('Error al obtener ejercicios recomendados:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedHomeExercises = async () => {
    if (!trainingType) {
      Alert.alert('Error', 'Por favor selecciona un tipo de entrenamiento.');
      return;
    }

    setLoading(true);
    try {
      const body = { tipoEntrenamiento: trainingType };
      if (trainingType === 'especifico' && muscleGroup) {
        body.grupoMuscular = muscleGroup;
      }

      const response = await fetch(`http://localhost:3000/recommended-home/1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        setRecommendedExercises(data);
        setSelectedExercise(null);
        setModalVisible(true);
        setCurrentCategory('home');
      } else {
        Alert.alert('Error', 'No se pudieron obtener ejercicios recomendados.');
      }
    } catch (error) {
      console.error('Error al obtener ejercicios en casa:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
      setTrainingTypeModalVisible(false);
      setMuscleGroupModalVisible(false);
    }
  };

  const selectTrainingType = (type) => {
    setTrainingType(type);
    if (type === 'especifico' && (userExperience === 'Intermedio' || userExperience === 'Avanzado')) {
      setMuscleGroupModalVisible(true);
    } else {
      fetchRecommendedHomeExercises();
    }
  };

  const selectMuscleGroup = (group) => {
    setMuscleGroup(group);
    fetchRecommendedHomeExercises();
  };

  const addToRoutine = () => {
    if (!selectedExercise) {
      Alert.alert('Error', 'Por favor selecciona un ejercicio antes de agregarlo.');
      return;
    }

    setRoutines((prevRoutines) => ({
      ...prevRoutines,
      [currentCategory]: [...prevRoutines[currentCategory], selectedExercise],
    }));

    setModalVisible(false);
    Alert.alert('Éxito', `${selectedExercise.name} fue agregado a tu rutina`);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => {
        if (item.title === 'Ejercicio en Casa') {
          setTrainingTypeModalVisible(true);
        } else {
          fetchRecommendedExercises(item.title);
        }
      }}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderRoutineList = (category, data) => (
    <View>
      <Text style={styles.routineTitle}>{category}</Text>
      {data.length === 0 ? (
        <Text style={styles.noExercises}>No hay ejercicios aún.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.exerciseCard}>
              <Text style={styles.exerciseTitle}>{item.name}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );

  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.exerciseItem,
        selectedExercise?.name === item.name && { backgroundColor: '#d3f9d8' },
      ]}
      onPress={() => setSelectedExercise(item)}
    >
      <Text style={styles.exerciseTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Selecciona una categoría:</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        numColumns={2}
        columnWrapperStyle={styles.categoryRow}
      />

      <View style={styles.routineContainer}>
        {renderRoutineList('Cardio', routines.cardio)}
        {renderRoutineList('Gimnasio', routines.gym)}
        {renderRoutineList('Ejercicio en Casa', routines.home)}
        {renderRoutineList('Calistenia', routines.calisthenics)}
      </View>

      {/* Modal para tipo de entrenamiento */}
      <Modal
        visible={trainingTypeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTrainingTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona el tipo de entrenamiento:</Text>
            {['Fullbody', 'Tren Superior', 'Tren Inferior']
              .concat(userExperience !== 'Principiante' ? ['Específico'] : [])
              .map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.trainingOption}
                  onPress={() => selectTrainingType(option.toLowerCase().replace(' ', ''))}
                >
                  <Text style={styles.trainingOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </Modal>

      {/* Modal para grupo muscular */}
      <Modal
        visible={muscleGroupModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMuscleGroupModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona el grupo muscular:</Text>
            {['Bíceps', 'Tríceps', 'Pectorales', 'Espalda', 'Piernas'].map((group, index) => (
              <TouchableOpacity
                key={index}
                style={styles.trainingOption}
                onPress={() => selectMuscleGroup(group.toLowerCase())}
              >
                <Text style={styles.trainingOptionText}>{group}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal para ejercicios */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecciona un ejercicio:</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <FlatList
              data={recommendedExercises}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderExerciseItem}
            />
          )}
          <Button title="Agregar" onPress={addToRoutine} />
        </View>
      </Modal>
    </ScrollView>
  );
}

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
});
