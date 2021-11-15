import React, {FC, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {MainContext} from '../context/MainContext';

interface ISettingsScreen {}

const SettingsScreen: FC<ISettingsScreen> = () => {
  const {mode, setMode} = useContext(MainContext);

  return (
    <View style={styles.container}>
      <BouncyCheckbox
        textStyle={styles.checkboxText}
        size={25}
        text="Image labeling"
        style={styles.checkbox}
        onPress={() => setMode('image_label')}
        isChecked={mode === 'image_label'}
        disableBuiltInState
      />
      <BouncyCheckbox
        textStyle={styles.checkboxText}
        style={styles.checkbox}
        size={25}
        text="Barcode scanning"
        isChecked={mode === 'barcode_scan'}
        onPress={() => setMode('barcode_scan')}
        disableBuiltInState
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
