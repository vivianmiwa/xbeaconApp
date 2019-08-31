import React, {Component} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from "react-native";
import api from '../services/api';
import axios from 'axios';

export default class Main extends Component{

  static navigationOptions = {
    title: "Lista de Beacons",
    data: []
  };

  constructor(props) {
    super(props);
    this.state = {
      beacons:[]
    }
  }

  componentDidMount() {
    axios.get('http://192.168.100.134:3000/api/list')
    .then(response =>{
          this.setState({beacons: response.data})
    })
    .catch(error => {
      console.log(error);
    });
  }

  renderItem = ({ item }) => (
    <View style = {styles.beaconsContainer}>
      <Text style = {styles.beaconsNome}>{item.nome}</Text>
      <TouchableOpacity style = {styles.beaconsButton} onPress = {() => {}}>
        <Text style = {styles.beaconsButtonText}>Exibir detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  render(){
    return(
      <View style = {styles.container}>
        <FlatList
        contentContainerStyle = {styles.list}
        data = {this.state.beacons}
        keyExtrator = {item => item.id} //função que recebe cada item e retorna seu id
        renderItem = {this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },

  list: {
    padding: 20
  },

  beaconsContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 20,
    marginBottom: 20
  },

  beaconsNome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },

  beaconsButton: {
    height: 42,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#DA552F",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },

  beaconsButtonText: {
    fontSize: 16,
    color: "#DA552F",
    fontWeight: "bold"
  }
});
