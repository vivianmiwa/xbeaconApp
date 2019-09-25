import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Home from '../view/home.js';
import Menu from './menu.js';
import Beacon from '../view/beacon.js';

const Routes = createAppContainer(

  createBottomTabNavigator({
    Home: Home,
    Beacons: Menu,
  }),
);

export default Routes;
