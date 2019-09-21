import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from "./pages/main.js";
import Beacon from "./pages/beacon.js";

const Routes = createAppContainer(
  createStackNavigator({
    Lista: Main,
    Beacon: Beacon,
  })
);

export default Routes;
