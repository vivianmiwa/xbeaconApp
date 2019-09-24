<<<<<<< HEAD
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
=======
import { createAppContainer } from 'react-navigation';
>>>>>>> 373f8b3bca74bcbca441135665167a5632d7e485
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
