import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Views', { option: 1 })}>
        <Text>1. Lista de todos los pendientes (solo IDs)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Views', { option: 2 })}>
        <Text>2. Lista de todos los pendientes (IDs y Titles)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Views', { option: 3 })}>
        <Text>3. Lista de todos los pendientes sin resolver (ID y Title)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Views', { option: 4 })}>
        <Text>4. Lista de todos los pendientes resueltos (ID y Title)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Views', { option: 5 })}>
        <Text>5. Lista de todos los pendientes (IDs y userID)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Views', { option: 6 })}>
        <Text>6. Lista de todos los pendientes resueltos (ID y userID)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Views', { option: 7 })}>
        <Text>7. Lista de todos los pendientes sin resolver (ID y userID)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#8097c1',
    padding: 10,
    marginBottom: 10, 
    width: '80%', 
    borderRadius: 5, 
  },
});

export default Home;
