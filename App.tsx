import React from 'react';
import JSICamera from './app/jsi/JSICamera';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import BridgeCamera from './app/bridge/BridgeCamera';
import SettingsScreen from './app/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false, unmountOnBlur: true}}>
        <Tab.Screen name="JSI" component={JSICamera} />
        <Tab.Screen name="Bridge" component={BridgeCamera} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
