import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const Views = ({ route }) => {
  const { option } = route.params;
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, [option]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
      const data = response.data;
      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderTodos = () => {
    let filteredTodos = todos;

    switch (option) {
      case 1: // Lista de todos los pendientes (solo IDs)
        return filteredTodos.map(todo => <Text key={todo.id}>ID: {todo.id}</Text>);
      case 2: // Lista de todos los pendientes (IDs y Titles)
        return filteredTodos.map(todo => (
          <View key={todo.id}>
            <Text>ID: {todo.id}</Text>
            <Text>Title: {todo.title}</Text>
            <Text></Text>
          </View>
        ));
      case 3: // Lista de todos los pendientes sin resolver (ID y Title)
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        return filteredTodos.map(todo => (
          <View key={todo.id}>
            <Text>ID: {todo.id}</Text>
            <Text>Title: {todo.title}</Text>            
            <Text></Text>
          </View>
        ));
      case 4: // Lista de todos los pendientes resueltos (ID y Title)
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        return filteredTodos.map(todo => (
          <View key={todo.id}>
            <Text>ID: {todo.id}</Text>
            <Text>Title: {todo.title}</Text>
            <Text></Text>
          </View>
        ));
      case 5: // Lista de todos los pendientes (IDs y userID)
        return filteredTodos.map(todo => (
          <View key={todo.id}>
            <Text>ID: {todo.id}</Text>
            <Text>User ID: {todo.userId}</Text>
          </View>
        ));
      case 6: // Lista de todos los pendientes resueltos (ID y userID)
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        return filteredTodos.map(todo => (
          <View key={todo.id}>
            <Text>ID: {todo.id}</Text>
            <Text>User ID: {todo.userId}</Text>
            <Text></Text>
          </View>
        ));
      case 7: // Lista de todos los pendientes sin resolver (ID y userID)
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        return filteredTodos.map(todo => (
          <View key={todo.id}>
            <Text>ID: {todo.id}</Text>
            <Text>User ID: {todo.userId}</Text>
            <Text></Text>
          </View>
        ));
      default:
        return <Text>No ha seleccionado ninguna opción válida</Text>;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderTodos()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Views;