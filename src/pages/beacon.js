import React from 'react';
import {View, Text, StyleSheet, Button, Linking, Platform} from 'react-native';
import { WebView } from 'react-native-webview';
import { DeviceEventEmitter } from 'react-native'
import Beacons from 'react-native-beacons-manager'

const Beacon = ({ navigation }) => (
  <View style = {styles.container}>
    <Text style = {styles.titulo}>{navigation.state.params.beacon.textos[0].titulo}</Text>
    <Text style = {styles.texto}>{navigation.state.params.beacon.textos[0].texto}</Text>
    <Button title="Saiba mais" onPress={ ()=>{ Linking.openURL(navigation.state.params.beacon.links[0].url)}}/>
  </View>
);

Beacon.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.beacon.nome,
  headerStyle: {
  backgroundColor: '#008ae6',
},
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  }
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
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 20,
    backgroundColor: "#FFF"
  }
});
