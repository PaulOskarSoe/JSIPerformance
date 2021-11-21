import React, {FC, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {MainContext, MLMode} from '../context/MainContext';
import RNPickerSelect from 'react-native-picker-select';

interface ISettingsScreen {}

interface IMLOptions {
  label: string;
  value: MLMode;
}

const SettingsScreen: FC<ISettingsScreen> = () => {
  const {mode, setMode} = useContext(MainContext);

  const options: IMLOptions[] = [
    {label: 'Image labeling', value: 'image_label'},
    {label: 'Barcode scanning', value: 'barcode_scan'},
    {label: 'Text recognizition', value: 'text_regocnizition'},
  ];

  return (
    <View style={styles.container}>
      <RNPickerSelect
        items={options}
        onValueChange={val => setMode(val)}
        value={mode}
      />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#FFFFFF',
    height: '100%',
    padding: 20,
  },
  checkbox: {
    paddingBottom: 20,
  },
  checkboxText: {
    color: 'black',
    fontWeight: '600',
  },
});
