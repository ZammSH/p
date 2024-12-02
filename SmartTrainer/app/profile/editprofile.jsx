import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function EditProfile() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userWeight, setUserWeight] = useState('');
  const [userHeight, setUserHeight] = useState('');
  const [userIllnesses, setUserIllnesses] = useState('');
  const [userInjuries, setUserInjuries] = useState('');
  const [userExperience, setUserExperience] = useState('');
  const [userEquipment, setUserEquipment] = useState('');
  const [userObjective, setUserObjective] = useState('');
  const [userAvailability, setUserAvailability] = useState('');
  const router = useRouter();

  // Función para obtener los datos del usuario desde el servidor
  const fetchUserFromServer = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setUserName(data.nombre || '');
        setUserLastName(data.apellido || '');
        setUserEmail(data.correo || '');
        setUserWeight(data.peso ? data.peso.toString() : '');
        setUserHeight(data.estatura ? data.estatura.toString() : '');
        setUserIllnesses(data.enfermedades || 'Ninguna');
        setUserInjuries(data.lesiones || '');
        setUserExperience(data.experiencia || 'Principiante');
        setUserEquipment(data.equipo || '');
        setUserObjective(data.objetivo || 'Mantenimiento');
        setUserAvailability(data.disponibilidad ? data.disponibilidad.toString() : '');
      } else {
        Alert.alert('Error', 'No se pudo obtener los datos del usuario');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.usuario_id);
        // Intentamos obtener los datos del usuario del servidor
        fetchUserFromServer(user.usuario_id);
      } else {
        console.log('No se encontró información en AsyncStorage');
      }
    };

    fetchUser();
  }, []);

  const handleSaveChanges = async () => {
    // Verifica si el peso es un número válido antes de enviar
    if (isNaN(userWeight) || userWeight.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un peso válido.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: userName,
          apellido: userLastName,
          correo: userEmail,
          peso: parseFloat(userWeight),
          estatura: parseFloat(userHeight),
          enfermedades: userIllnesses,
          lesiones: userInjuries,
          experiencia: userExperience,
          equipo: userEquipment,
          objetivo: userObjective,
          disponibilidad: parseInt(userAvailability),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Muestra los datos que se guardarán en AsyncStorage
        console.log('Guardando datos en AsyncStorage:', {
          usuario_id: userId,
          nombre: userName,
          apellido: userLastName,
          correo: userEmail,
          peso: parseFloat(userWeight),
          estatura: parseFloat(userHeight),
          enfermedades: userIllnesses,
          lesiones: userInjuries,
          experiencia: userExperience,
          equipo: userEquipment,
          objetivo: userObjective,
          disponibilidad: parseInt(userAvailability),
        });

        // Actualiza los datos en AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify({
          usuario_id: userId,
          nombre: userName,
          apellido: userLastName,
          correo: userEmail,
          peso: parseFloat(userWeight),
          estatura: parseFloat(userHeight),
          enfermedades: userIllnesses,
          lesiones: userInjuries,
          experiencia: userExperience,
          equipo: userEquipment,
          objetivo: userObjective,
          disponibilidad: parseInt(userAvailability),
        }));

        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        router.push('/profile');
      } else {
        Alert.alert('Error', responseData.message || 'No se pudo actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={userName}
        onChangeText={setUserName}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={userLastName}
        onChangeText={setUserLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={userEmail}
        onChangeText={setUserEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Peso"
        value={userWeight}
        onChangeText={setUserWeight}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Estatura"
        value={userHeight}
        onChangeText={setUserHeight}
        keyboardType="numeric"
      />

      <Picker
        selectedValue={userIllnesses}
        onValueChange={(itemValue) => setUserIllnesses(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Selecciona una opción" value="" />
        <Picker.Item label="Ninguna" value="Ninguna" />
        <Picker.Item label="Diabetes" value="Diabetes" />
        <Picker.Item label="Hipertensión" value="Hipertensión" />
        <Picker.Item label="Asma" value="Asma" />
        <Picker.Item label="Otra" value="Otra" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Lesiones"
        value={userInjuries}
        onChangeText={setUserInjuries}
      />

      <Picker
        selectedValue={userObjective}
        onValueChange={(itemValue) => setUserObjective(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Perder Peso" value="Perder Peso" />
        <Picker.Item label="Ganar Músculo" value="Ganancia muscular" />
        <Picker.Item label="Mantenimiento" value="Mantenimiento" />
      </Picker>

      <Picker
        selectedValue={userExperience}
        onValueChange={(itemValue) => setUserExperience(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Principiante" value="Principiante" />
        <Picker.Item label="Intermedio" value="Intermedio" />
        <Picker.Item label="Avanzado" value="Avanzado" />
      </Picker>
      
      <TextInput
        style={styles.input}
        placeholder="Equipo disponible"
        value={userEquipment}
        onChangeText={setUserEquipment}
      />

      <TextInput
        style={styles.input}
        placeholder="Disponibilidad (minutos)"
        value={userAvailability}
        onChangeText={setUserAvailability}
        keyboardType="numeric"
      />

      <Button title="Guardar Cambios" onPress={handleSaveChanges} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});
