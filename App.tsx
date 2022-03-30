import React from 'react';
import JSICamera from './app/jsi/JSICamera';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import BridgeCamera from './app/bridge/BridgeCamera';
import BenchMarkScreen from './app/benchmarks/BenchMarkScreen';
import MainContextProvider from './app/context/MainContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import JsiAnimation from './app/jsi/JsiAnimation';
import BridgeAnimation from './app/bridge/BridgeAnimation';

export type MainStackParamList = {
  BottomTabs: undefined;
  JsiAnimationScreen: undefined;
  BridgeAnimationScreen: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();

const BottomTabs = () => (
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
);

const App = () => {
  return (
    <MainContextProvider>
      <NavigationContainer>
        <MainStack.Navigator initialRouteName="BottomTabs">
          <MainStack.Screen
            name="BottomTabs"
            options={() => ({headerShown: false})}
            component={BottomTabs}
          />
          <MainStack.Screen
            name="JsiAnimationScreen"
            options={() => ({headerTitle: 'JSI animations'})}
            component={JsiAnimation}
          />
          <MainStack.Screen
            name="BridgeAnimationScreen"
            options={() => ({headerTitle: 'Bridge animations'})}
            component={BridgeAnimation}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </MainContextProvider>
  );
};

export default App;
