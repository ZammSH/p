import React, { useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

export default function Categories() {
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRoutine = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/generate-routine', {
        usuarioId: 1, // Reemplazar con el ID del usuario actual
      });

      if (response.data && response.data.routine) {
        setRoutine(response.data.routine);
      } else {
        Alert.alert('Error', 'No se pudo generar la rutina.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const renderExerciseItem = ({ item }) => (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseTitle}>{item.name}</Text>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Aquí está tu rutina personalizada:</Text>
      <TouchableOpacity style={styles.generateButton} onPress={fetchRoutine}>
        <Text style={styles.generateButtonText}>Generar Rutina</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007bff" />}

      {routine && (
        <FlatList
          data={routine}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderExerciseItem}
          contentContainerStyle={styles.listContainer}
          style={styles.flatList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  exerciseCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007bff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
  },
});
