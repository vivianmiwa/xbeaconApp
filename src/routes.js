import { createAppContainer, createStackNavigator } from 'react-navigation';

import Main from "./pages/main.js";

const RootStack = createStackNavigator({
    Home: {
      screen: Main
    }
  });

const App = createAppContainer(RootStack);

export default App;
