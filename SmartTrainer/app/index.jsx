import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('emcohez@gmail.com');
  const [password, setPassword] = useState('123456');
    
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Aquí puedes agregar la lógica de autenticación con Clerk o cualquier backend.
    if (email === 'emcohez@gmail.com' && password === '123456') {
      router.push('/(tabs)/home'); // Navega a la pantalla de rutina al iniciar sesión exitosamente.
    } else {
      Alert.alert('Error', 'Credenciales incorrectas.');
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
        onPress={() => router.push('/register')} // Cambia a la pantalla de registro si se implementa.
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
