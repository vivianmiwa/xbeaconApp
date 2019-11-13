import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Home from '../view/home.js';
import StackNav from './stacknav.js';
//import Beacon from '../view/beacon.js';

const Routes = createAppContainer(

  createBottomTabNavigator({
    Home: Home,
    Beacons: StackNav,
  }),
);

export default Routes;
