import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from '../view/main.js';
import Beacon from '../view/beacon.js';

const StackNav = createAppContainer(

  createStackNavigator({
    Main: Main,
    Beacon: Beacon,
  }),
);

export default StackNav;
