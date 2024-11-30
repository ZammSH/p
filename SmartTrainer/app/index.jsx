import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para almacenamiento local
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          contraseña: password,
        }),
      });

      const data = await response.json();

      if (response.status === 200 && data.success) {
        // Guardar el usuario en AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        router.push('/(tabs)/home'); // Navegar a la pantalla principal
      } else {
        Alert.alert('Error', 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema con la conexión.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Iniciar Sesión" onPress={handleLogin} />
      <Text
        style={styles.registerLink}
        onPress={() => router.push('/register')}
      >
        ¿No tienes una cuenta? Regístrate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
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
  registerLink: {
    marginTop: 15,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
