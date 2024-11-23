import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [diseases, setDiseases] = useState('');
  const [injuries, setInjuries] = useState('');

  const handleRegister = () => {
    if (!name || !age || !weight || !height || !diseases) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    Alert.alert('Registro exitoso', 'Tus datos han sido registrados correctamente.');
    router.push('/'); // Redirige al inicio después del registro.
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
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
        <Picker.Item label="Ninguna" value="none" />
        <Picker.Item label="Diabetes" value="diabetes" />
        <Picker.Item label="Hipertensión" value="hypertension" />
        <Picker.Item label="Asma" value="asthma" />
        <Picker.Item label="Otra" value="other" />
      </Picker>

      <Text style={styles.label}>Lesiones Previas:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Describe tus lesiones previas (si tienes)"
        value={injuries}
        onChangeText={setInjuries}
        multiline
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
