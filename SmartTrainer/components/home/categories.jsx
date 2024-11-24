import React from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const categories = [
  { id: '1', title: 'Cardio', icon: '🏃' },
  { id: '2', title: 'Gimnasio', icon: '🏋️' },
  { id: '3', title: 'Ejercicio en Casa', icon: '🏠' },
  { id: '4', title: 'Calistenia', icon: '🤸' },
];

export default function Categories() {
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={renderCategoryItem}
      numColumns={2}
      columnWrapperStyle={styles.categoryRow}
      contentContainerStyle={styles.categoryList}
    />
  );
}

const styles = StyleSheet.create({
  categoryList: {
    paddingBottom: 20,
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
  categoryIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
