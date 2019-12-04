import React, {Component} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ToastAndroid, AppState} from "react-native";
import api from '../model/api.js';
import axios from 'axios';
import Beacons from 'react-native-beacons-manager'
import { EventRegister } from 'react-native-event-listeners';
import xbeacon from '../service/xbeacon.js';

const RANGING_TITLE = 'Found Beacons:';
const RANGING_SECTION_ID = 1;

export default class Main extends Component{


  constructor(props) {
    super(props);
  }

  beaconsDidRangeEvent = null;
  // will be set as a reference to service did connect event:
  beaconsServiceDidConnect: any = null;

  state = {
    uuid: '',
    identifier: '',
    beacons: [
      { key: 1, data: [], title: RANGING_TITLE, sectionId: RANGING_SECTION_ID },
    ],
    beaconsAPI: [
      { key: 1, data: [], title: RANGING_TITLE, sectionId: RANGING_SECTION_ID },
    ],
    update: [],
    parametros: [],
    filtros: [],

    bluetoothSupport: '',
  }

  static navigationOptions = {
    title: "Beacons próximos",
  };

  componentDidMount() {

    axios.get('http://192.168.100.134:3000/api/list')
    .then(response =>{
          this.setState({beaconsAPI: response.data})
    })
    .catch(error => {
      console.log(error);
    });



    this.subs = [
      this.props.navigation.addListener("willFocus", () => {
        this.handlesOnAddIbeacon();
        this.checkBluetoothSupport();
      })
    ];

    Beacons.addIBeaconsDetection()
      .then(() => Beacons.addEddystoneUIDDetection())
      .then(() => Beacons.addEddystoneURLDetection())
      .then(() => Beacons.addEddystoneTLMDetection())
      .then(() => Beacons.addAltBeaconsDetection())
      .then(() => Beacons.addEstimotesDetection())
      .catch(error =>
        ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT)
      );
    //
    // component state aware here - attach events
    //

    // we need to wait for service connection to ensure synchronization:
    this.beaconsServiceDidConnect = Beacons.BeaconsEventEmitter.addListener(
      'beaconServiceConnected',
      () => {
        console.log('service connected');
        this.startRangingAndMonitoring();
      },
    );

    // Ranging: Listen for beacon changes
    this.beaconsDidRangeEvent = Beacons.BeaconsEventEmitter.addListener(
      'beaconsDidRange',
      (response: {
        beacons: Array<{
          distance: number,
          proximity: string,
          rssi: string,
          uuid: string,
        }>,
        uuid: string,
        indetifier: string
      }) => {
        response.beacons.forEach(beacon =>
          this.updateBeaconState(RANGING_SECTION_ID, {
            identifier: response.identifier,
            uuid: String(beacon.uuid),
            major: parseInt(beacon.major, 10) >= 0 ? beacon.major : '',
            minor: parseInt(beacon.minor, 10) >= 0 ? beacon.minor : '',
            proximity: beacon.proximity ? beacon.proximity : '',
            rssi: beacon.rssi ? beacon.rssi : '',
            distance: beacon.distance ? beacon.distance : '',

          }),
        );
        // this.timeoutHandle = setTimeout(()=>{
        //
        // }, 5000)
        EventRegister.emit('UpdateHuntingEggs');
      },
    );

    this.updateHuntingEggsListener = EventRegister.addEventListener('UpdateHuntingEggs', () => {
      const state = this.state;
      this.state.update = '';
//      this.state.update = "";
      //console.log("beaconssssssss",this.state.beacons);
/*
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
}*/

  //  console.log("bbbbbbbb", this.state.beacons[0]);
  //const updateParametros = "";
    this.state.beacons[0].data.map((item, index) => {
      axios.get('http://192.168.100.134:3000/api/beacons/' + item.minor)
      .then(response =>{
        //if(response.data.minor === item.id){
        if(response.message != "Beacon nao encontrado"){
          //if(item.minor === response.data.minor){
    //      if(this.state.filtros[response.data.id] != this.state.parametro){
              this.updateParametroState(response.data.id, {
                id : response.data.id,
                distance : item.distance.toFixed(2),
                proximity : item.proximity,
                nome : response.data.nome
              })
              //console.log("STTTTTT", this.state.filtros);
            //  console.log("OIE", response.data.id);
          //  }
        //    }
          }

        })
        .catch(error => {
          //console.log("beacon n cadastrado");
        });

      //  this.state.update = this.state update + "beacon" + item.minor + ":\n" + item.distance.toFixed(2) + "m\n\n";
    //  this.state.update= this.state.update + "distância do beacon "+ item.minor +":\n" + item.distance.toFixed(2) + " m\n\n";

      });
    //  console.log("parametros:", this.state.parametros, "state::", state.parametros);
    });
  }

  componentWillUnmount(){
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.stopRangingAndMonitoring();
    // remove ranging event we registered at componentDidMount:
    this.beaconsDidRangeEvent.remove();
    EventRegister.removeEventListener(this.changeStateFoundListener);
    EventRegister.removeEventListener(this.restartVariablesListener);
    EventRegister.removeEventListener(this.updateHuntingEggsListener);
  //  EventRegister.removeEventListener(this.huntingEndListener);
  }

  renderItem = ({ item, index }) => (
    <View style = {styles.beaconsContainer}>
      <Text style = {styles.beaconsNome}>{item.nome}</Text>
      <Text style = {styles.beaconsDistancia}>{item.proximity}:   {item.distance}m</Text>
      <TouchableOpacity
        style = {styles.beaconsButton}
        onPress = {() => {
          console.log(this.state.beaconsAPI);
          this.props.navigation.navigate('Beacon', { beacon: this.state.beaconsAPI[this.state.parametros[index].id]});
        }}
      >
        <Text style = {styles.beaconsButtonText}>Exibir detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  render(){
   return(
     <SafeAreaView style={styles.container}>
       <FlatList
       contentContainerStyle = {styles.list}
       data = {this.state.parametros} //beaconsAPI
       keyExtractor = {(item, index) => index.toString()}
       renderItem = {this.renderItem}
       />
       <Text style = {{fontFamily: 'Lobster_Regular', fontSize: 20}}>
         {this.state.update}
       </Text>
    </SafeAreaView>
   );
  }

  renderEmpty = () => {
    return (
      <View>
        <Text style={{fontFamily: 'Lobster_Regular', fontSize: 20}}>
        {this.state.update} //tava update
        </Text>
      </View>
    );
  };

  updateParametroState = (

    forSectionId: number = 0, // section identifier
    { id, proximity, distance, nome }, // beacon

  ) => {
    const { parametros } = this.state;
    state = this.state;
    const flag = false;
    const updatedParametros = parametros.map(parametro => {
      if (parametro.id === forSectionId) {
        parametro.proximity = proximity;
        parametro.distance = distance;
        this.flag = true;
        console.log("aaaaaaaaa",parametro);
        return parametro;
      }

      console.log("cccccc",parametro);
      this.flag = false;
      return parametro;
    });

    if(!this.flag){
    //  console.log("entrou ::::", id, proximity, distance, nome);
      //parametros.filter(id => id != forSectionId);
      parametros.push({id, proximity, distance, nome});
      console.log("parametros true flag", parametros);
      this.setState(this.parametros);

    }else{

      this.setState({ parametros: updatedParametros }); //mudei aqui, antes era beaconsAPI
      console.log("parametrosssssss22223322ss", parametros);
    }
  };


  updateBeaconState = (
    forSectionId: number = 0, // section identifier
    { identifier, uuid, minor, major, ...rest }, // beacon
  ) => {
    const { beacons } = this.state;
    state = this.state;
    const updatedBeacons = beacons.map(beacon => {
      if (beacon.sectionId === forSectionId) {
        const sameBeacon = data =>
          !(
            data.uuid === uuid &&
            data.identifier === identifier &&
            data.minor === minor &&
            data.major === major
          );

        const updatedData = [].concat(...beacon.data.filter(sameBeacon), {
          identifier,
          uuid,
          minor,
          major,
          ...rest,
        });
        return { ...beacon, data: updatedData };
      }
      return beacon;
    });
    this.setState({ beacons: updatedBeacons }); //mudei aqui, antes era beaconsAPI
  };

  startRangingAndMonitoring = async () => {
    const { identifier } = this.state;
    const region = { identifier }; // minor, major, uuid are null here

    try {
      await Beacons.startRangingBeaconsInRegion(region);
      console.log('Beacons ranging started successfully');
      await Beacons.startMonitoringForRegion(region);
      console.log('Beacons monitoring started successfully');
    } catch (error) {
      throw error;
    }
  };

  stopRangingAndMonitoring = async () => {
    const { identifier } = this.state;
    const region = { identifier }; // minor and major are null here

    try {
      await Beacons.stopRangingBeaconsInRegion(region);
      console.log('Beacons ranging stopped successfully');
      await Beacons.stopMonitoringForRegion(region);
      console.log('Beacons monitoring stopped successfully');
    } catch (error) {
      throw error;
    }
  };

  handlesOnAddIbeacon = async () => {
    state = this.state;
    this.state.beacons = [
      { key: 1, data: [], title: RANGING_TITLE, sectionId: RANGING_SECTION_ID },
    ];
    this.setState(state);
    try {
      await Beacons.addIBeaconsDetection();
      await this.startRangingAndMonitoring();
      ToastAndroid.showWithGravity(
        'Caça Iniciada',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } catch (error) {
      ToastAndroid.show(
        `Error: ${error.message}`,
        ToastAndroid.SHORT
      );
    }
  };

  handlesOnRemoveIbeacon = async (callback) => {
    try {
      await Beacons.removeIBeaconsDetection();
      await this.stopRangingAndMonitoring();
      ToastAndroid.showWithGravity(
        `Caça ${callback}`, //pausada ou encerrada
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    } catch (error) {
      ToastAndroid.show(
        `Error: ${error.message}`,
        ToastAndroid.SHORT
      );
    }
  };

  checkBluetoothSupport = async () => {
    const state = this.state;
    try {
      const status = await Beacons.checkTransmissionSupported();
      if(status === 'SUPPORTED'){
        state.bluetoothSupport = "SUPPORTED";
      }else if(status.contains('BLE')){
        state.bluetoothSupport = "A versão bluetooth do seu aparelho não é compatível com a tecnologia BLE 4.0, o que pode ocasionar falhas no funcionamento correto da aplicação.";
      }else if(status.contains('SDK')){
        state.bluetoothSupport = "A versão bluetooth do seu aparelho não atende aos requisitos para essa aplicação, e isso pode ocasionar falhas no funcionamento correto da mesma.";
      }else{
        state.bluetoothSupport = "Impossível detectar as características do seu bluetooth, se o mesmo está ligado provavelmente não é compatível com a versão demandada para essa aplicação.";
      }
      this.setState(state);
    } catch (error) {
      //console.log(`Erro ao verificar compatibilidade do bluetooth: ${error}`)
    }
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

  beaconsDistancia: {
    fontSize: 15,
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
