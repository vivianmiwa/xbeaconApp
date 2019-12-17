import React, {Component} from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";

export default class Home extends Component{

  static navigationOptions = {
    title: "Home",
    data: []
  };
  render(){
    return(
      <View style = {styles.container}>
        <Text style = {styles.titulo}>X-Beacon</Text>
        <Image
          style = {styles.image}
          source = {{uri: 'http://eonbeacon.com/wp-content/uploads/2015/07/beacon_overview_big_update.png'}}
        />
        <TouchableOpacity
          style = {styles.button}
          onPress = {() => this.props.navigation.navigate('Main')}>
          <Text style = {styles.buttonText}>Procurar beacons</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#FFF",
  },

  titulo: {
    marginHorizontal: 125,
    marginBottom: 70,
    alignItems: 'center',
    color: '#DA552F',
    fontSize: 20,
    fontWeight: "bold"
  },

  image: {
    marginHorizontal: 55,
    marginBottom: 50,
    alignItems: 'center',
    width: 270,
    height: 150,
  },

  button: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#DA552F",
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 50,
    backgroundColor: "#DA552F",
    backgroundColor: "transparent",
    padding: 10
  },

  buttonText: {
    color: '#DA552F',
    fontSize: 16,
    fontWeight: "bold"
  }
})
