import React, {Component} from "react";
import {View, Text, StyleSheet} from "react-native";
import api from '../services/api';
import axios from 'axios';

export default class Main extends Component{
  static navigationOptions = {
    title: "Beacons",
    data: []
};
  constructor(props) {
    super(props);
    this.state = {
      beacons:[]
    }
  }

componentDidMount() {
  axios.get('http://179.106.206.133:3000/api/list')
  .then(response =>{
        this.setState({beacons: response.data})
  })
  .catch(error => {
    console.log(error);
  });
}


  /*componentDidMount(){

    this.loadBeacons();
  }

  loadBeacons = async () => {

    const response = await api.get("/list");

    const { docs } = respose.data;

    console.log(docs);
  };
*/
  render(){
    return(
      <View>
        <Text>Olá</Text>
        {this.state.beacons.map((beacon,index) => {
          return(
            <View key={index}>
              <Text>Beacon</Text>
              <Text>{beacon.nome}</Text>
            </View>
          )
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  }
});
