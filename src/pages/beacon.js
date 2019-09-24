import React from 'react';
<<<<<<< HEAD
import {View, Text, StyleSheet, Button, Linking, Platform, Image, SafeAreaView, ScrollView} from 'react-native';
=======
import {View, Text, StyleSheet, Button, Linking, Platform} from 'react-native';
>>>>>>> 373f8b3bca74bcbca441135665167a5632d7e485
import { WebView } from 'react-native-webview';
import { DeviceEventEmitter } from 'react-native'
import Beacons from 'react-native-beacons-manager'

const Beacon = ({ navigation }) => (
  <View style = {styles.container}>
    <Image
      style = {styles.foto}
      source = {{uri: navigation.state.params.beacon.arquivos_externos[0].url}}
    />
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style = {styles.titulo}>{navigation.state.params.beacon.textos[0].titulo}</Text>
        <Text style = {styles.texto}>{navigation.state.params.beacon.textos[0].texto}</Text>
        <Button title="Saiba mais" onPress={ ()=>{ Linking.openURL(navigation.state.params.beacon.links[0].url)}}/>
      </ScrollView>
    </SafeAreaView>
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
    flex: 2,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },

  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 3,
  },

  titulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    padding: 20,
    backgroundColor: "#FFF"
  },

  texto: {
    flex: 2,
    fontSize: 16,
    color: "#333",
    padding: 20,
    backgroundColor: "#FFF"
  },

  foto: {
    flex: 1,
    marginHorizontal: 10,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: "#FFF"
  }
});
