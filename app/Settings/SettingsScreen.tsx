import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface ISettingsScreen {}

const SettingsScreen: FC<ISettingsScreen> = () => {
  return (
    <View style={styles.container}>
      <Text />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({container: {flex: 1}});
