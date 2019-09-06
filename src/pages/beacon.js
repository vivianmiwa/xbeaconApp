import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Beacon = ({ navigation }) => (
  <View style = {styles.container}>
    <Text style = {styles.titulo}>{navigation.state.params.beacon.textos[0].titulo}</Text>
    <Text style = {styles.texto}>{navigation.state.params.beacon.textos[0].texto}</Text>
  </View>
);

Beacon.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.beacon.nome
});

export default Beacon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },

  titulo: {
    fontSize: 18,
    flex: 1,
    fontWeight: "bold",
    color: "#333",
    padding: 20,
    backgroundColor: "#FFF"
  },

  texto: {
    flex: 8,
    fontSize: 16,
    color: "#333",
    padding: 20,
    backgroundColor: "#FFF"
  }
});
