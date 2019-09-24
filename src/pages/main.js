import React, {Component} from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ToastAndroid} from "react-native";
import api from '../services/api';
import axios from 'axios';
import Beacons from 'react-native-beacons-manager'
import { EventRegister } from 'react-native-event-listeners';

const RANGING_TITLE = 'Found Beacons:';
const RANGING_SECTION_ID = 1;

export default class Main extends Component{

  static navigationOptions = {
    title: "Lista",
    data: []
  };

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
  }

  async componentDidMount() {
    axios.get('http://179.106.206.209:3000/api/list')
    .then(response =>{
          this.setState({beacons: response.data})
    })
    .catch(error => {
      console.log(error);
    });

    this.handlesOnAddIbeacon();

    await Beacons.addIBeaconsDetection()
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
        //console.log('service connected');
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
      //  console.log('BEACONS: ', response);

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
        EventRegister.emit('UpdateHuntingEggs');
      },
    );
  }

  componentWillUnmount(){
    this.handlesOnRemoveIbeacon("encerrado");
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
      <TouchableOpacity
        style = {styles.beaconsButton}
        onPress = {() => {
          this.props.navigation.navigate('Beacon', { beacon: item });
        }}
      >
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
          keyExtractor = { (item, index) => index.toString() } //função que recebe cada item e retorna seu id
          renderItem = {this.renderItem}
        />


      </View>
    );
  }

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
    this.setState({ beacons: updatedBeacons });
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
        `Caça ${callback}`,
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
