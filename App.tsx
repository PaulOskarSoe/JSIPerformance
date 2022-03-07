import React from 'react';
import JSICamera from './app/jsi/JSICamera';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import BridgeCamera from './app/bridge/BridgeCamera';
import BenchMarkScreen from './app/benchmarks/BenchMarkScreen';
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
          <Tab.Screen
            name="JSI"
            options={() => ({tabBarLabel: 'JSI Cam'})}
            component={JSICamera}
          />
          <Tab.Screen
            name="Bridge"
            options={() => ({tabBarLabel: 'Bridge Cam'})}
            component={BridgeCamera}
          />
          <Tab.Screen name="Benchmarks" component={BenchMarkScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </MainContextProvider>
  );
};

export default App;
