import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const initialRoutines = [
    { day: "Domingo", routines: ["Hiking - 2 hours"], status: "pending" },
  { day: "Lunes", routines: ["Cardio - 30 mins", "Push-ups - 20 reps"], status: "pending" },
  { day: "Martes", routines: ["Yoga - 1 hour", "Plank - 3 mins"], status: "pending" },
  { day: "Miércoles", routines: ["Running - 5 km", "Squats - 15 reps"], status: "pending" },
  { day: "Jueves", routines: ["Cycling - 40 mins", "Pull-ups - 10 reps"], status: "pending" },
  { day: "Viernes", routines: ["Swimming - 30 mins", "Stretching - 15 mins"], status: "pending" },
  { day: "Sábado", routines: ["Rest Day"], status: "pending" },
];

export default function Calendar() {
  const [routines, setRoutines] = useState(initialRoutines)
  const today = daysOfWeek[new Date().getDay()]
  useEffect(() => {
    const resetStorage = async () => {
      await AsyncStorage.removeItem("routines");
    }
    resetStorage();
  }, [])
   //Obtener Semana Actual
   const getCurrentWeek = () => {
    const now = new Date()
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1)
    const pastDaysOfYear = (now - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
   }

   const currentWeek = getCurrentWeek()

  //Cargar datos guardados
  useEffect(() => {
    const loadRoutines = async () => {
        try {
            const savedRoutines = await AsyncStorage.getItem("routines")
            const savedWeek = await AsyncStorage.getItem("currentWeek")

            if (savedRoutines && savedWeek) {
                if (parseInt(savedWeek) === currentWeek) {
                    setRoutines(JSON.parse(savedRoutines))
                } else {
                    setRoutines(initialRoutines)
                    await AsyncStorage.setItem("currentWeek", currentWeek.toString())
                }
            } else {
                setRoutines(initialRoutines)
                await AsyncStorage.setItem("currentWeek", currentWeek.toString())
            }
        } catch (error) {
            console.log("Error al cargar rutinas: ", error)
            setRoutines(initialRoutines)
        }
    }
    loadRoutines()
  }, [currentWeek])


  // Guardar la rutina al actualizar
  useEffect (() => {
    const saveRoutines = async () => {
        try {
            await AsyncStorage.setItem("routines", JSON.stringify(routines))
            await AsyncStorage.setItem("currentWeek", currentWeek.toString())
        } catch (error) {
            console.log("Error al guardar rutinas: ", error)
        }
    }
    saveRoutines()
  }, [routines, currentWeek])

  const completedRoutine = (day) => {
    if (day !== today){
        Alert.alert('Sólo puedes Seleccionar la rutina de hoy (${today})')
        return
    }
    setRoutines((prevRoutines) =>
      prevRoutines.map((routine) =>
        routine.day === day ? { ...routine, status: "completed" } : routine
      )
    );
  };

  useEffect(() => {
    setRoutines((prevRoutines) => 
        prevRoutines.map((routine) => {
            const isPast = daysOfWeek.indexOf(routine.day) < daysOfWeek.indexOf(today)
            if (isPast && routine.status === "pending"){
                return { ...routine, status: "missed"}
            }
            return routine
        })
    )
  }, [today])

  const renderItem = ({ item }) => {
    const isToday = item.day === today; // Verificar si el día es hoy
    const isPast = daysOfWeek.indexOf(item.day) < daysOfWeek.indexOf(today); // Días pasados

    return (
      <TouchableOpacity
        disabled={!isToday || isPast} // Deshabilitar días pasados o futuros
        style={[
          styles.dayCard,
          item.status === "completed" && styles.completedCard,
          item.status === "missed" && styles.missedCard,
          !isToday && !isPast && styles.futureCard, // Color para días futuros
        ]}
        onPress={() => completedRoutine(item.day)}
      >
        <View style={styles.cardContent}>
          <Text style={styles.dayTitle}>{item.day}</Text>
          {Array.isArray(item.routines) &&
            item.routines.map((routine, index) => (
              <Text key={index} style={styles.routineText}>
                {index + 1}. {routine}
              </Text>
            ))}
        </View>
        <MaterialIcons
            name= {item.status === "completed" ? "check" : item.status === "missed" ? "cancel": ""}
            size={35}
            color={item.status === "completed" ? "green": item.status === "missed" ? "red" : "transparent"}
            style = {styles.statusIcon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={routines}
      renderItem={renderItem}
      keyExtractor={(item) => item.day}
      ListHeaderComponent={
        <Text style={styles.title}>Agenda Semanal</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#3b3b3b",
  },
  dayCard: {
    backgroundColor: "#ffffff",
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  completedCard: {
    backgroundColor: "#e0f7e9",
  },
  missedCard: {
    backgroundColor: "#fde9ea",
  },
  futureCard: {
    backgroundColor: "#f0f0f0",
    opacity: 0.6
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  routineText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 2,
  },
  statusIcon: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statusIcon: {
    marginLeft: 10
  }
});
