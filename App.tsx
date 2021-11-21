import React from 'react';
import JSICamera from './app/jsi/JSICamera';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import BridgeCamera from './app/bridge/BridgeCamera';
import SettingsScreen from './app/settings/SettingsScreen';
import MainContextProvider from './app/context/MainContext';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <MainContextProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            unmountOnBlur: true,
            tabBarLabelPosition: 'beside-icon',
            tabBarLabelStyle: {
              fontWeight: '700',
              fontSize: 15,
              right: 15,
            },
            tabBarIconStyle: {display: 'none'},
          }}>
          <Tab.Screen name="JSI" component={JSICamera} />
          <Tab.Screen name="Bridge" component={BridgeCamera} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </MainContextProvider>
  );
};

export default App;
