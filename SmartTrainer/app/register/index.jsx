import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [diseases, setDiseases] = useState('');
  const [injuries, setInjuries] = useState('');
  const [experience, setExperience] = useState('');
  const [equipment, setEquipment] = useState('');
  const [objective, setObjective] = useState('');
  const [availability, setAvailability] = useState('');

  const handleRegister = async () => {
    const userData = {
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      contraseña: contraseña,
      peso: peso,
      estatura: estatura,
      enfermedades: enfermedades,
      lesiones: lesiones,
      experiencia: experiencia,
      equipo: equipo,
      objetivo: objetivo,
      disponibilidad: disponibilidad,
    };
  
    try {
      const response = await axios.post('http://localhost:3000/register', userData);
      if (response.status === 200) {
        alert('Usuario registrado con éxito');
      } else {
        alert('Error al registrar usuario: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Error al registrar usuario');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      {/* Campos de registro */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Estatura (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Enfermedades:</Text>
      <Picker
        selectedValue={diseases}
        onValueChange={(itemValue) => setDiseases(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona una opción" value="" />
        <Picker.Item label="Ninguna" value="Ninguna" />
        <Picker.Item label="Diabetes" value="Diabetes" />
        <Picker.Item label="Hipertensión" value="Hipertensión" />
        <Picker.Item label="Asma" value="Asma" />
        <Picker.Item label="Otra" value="Otra" />
      </Picker>

      <Text style={styles.label}>Lesiones Previas:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Describe tus lesiones previas (si tienes)"
        value={injuries}
        onChangeText={setInjuries}
        multiline
      />

      <Text style={styles.label}>Experiencia en el ejercicio:</Text>
      <Picker
        selectedValue={experience}
        onValueChange={(itemValue) => setExperience(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona una opción" value="" />
        <Picker.Item label="Principiante" value="Principiante" />
        <Picker.Item label="Intermedio" value="Intermedio" />
        <Picker.Item label="Avanzado" value="Avanzado" />
      </Picker>

      <Text style={styles.label}>Equipo disponible:</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe el equipo disponible (si tienes)"
        value={equipment}
        onChangeText={setEquipment}
      />

      <Text style={styles.label}>Objetivo:</Text>
      <Picker
        selectedValue={objective}
        onValueChange={(itemValue) => setObjective(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona una opción" value="" />
        <Picker.Item label="Perder Peso" value="Perder Peso" />
        <Picker.Item label="Ganar Músculo" value="Ganancia muscular" />
        <Picker.Item label="Mantenimiento" value="Mantenimiento" />
      </Picker>

      <Text style={styles.label}>Disponibilidad (minutos por día):</Text>
      <TextInput
        style={styles.input}
        placeholder="Tiempo disponible para entrenar"
        value={availability}
        onChangeText={setAvailability}
        keyboardType="numeric"
      />

      <Button title="Registrar" onPress={handleRegister} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
});

