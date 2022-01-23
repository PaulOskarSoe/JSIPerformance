import React, {FC, useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {MainContext, MLMode, ResultParameters} from '../context/MainContext';
import {storage} from '../storage';

interface ISettingsScreen {}

interface IMLOptions {
  label: string;
  value: MLMode;
}

const SettingsScreen: FC<ISettingsScreen> = () => {
  const {mode, setMode, labelResult, setLabelResult, testResults} =
    useContext(MainContext);

  const [results, setResults] = useState<any[]>([]);

  const options: IMLOptions[] = [
    {label: 'Barcode scanning', value: 'barcode_scan'},
    {label: 'Text recognizition', value: 'text_regocnizition'},
    {label: 'Face detection', value: 'face_detection'},
  ];

  useEffect(() => {
    const keys = storage.getAllKeys();

    const allValues: any[] = [];

    keys.forEach(key => {
      const value = storage.getString(key);

      if (value) {
        const parsedValue = JSON.parse(value);

        let totalResultsFound = 0;

        parsedValue.results.forEach((result: ResultParameters) => {
          console.log('parsedResult:', result.detected_by_frame);
          totalResultsFound += result.detected_by_frame as unknown as number;
        });

        console.log('totalResultsFound:', totalResultsFound);

        parsedValue.totalResults = totalResultsFound;
        parsedValue.arithmeticallyFound = parseFloat(
          `${totalResultsFound / parsedValue.results.length}`,
        ).toFixed(1);

        allValues.push(parsedValue);
      }
    });

    setResults(allValues);
  }, []);

  return (
    <View style={styles.container}>
      <RNPickerSelect
        style={{viewContainer: styles.picker}}
        items={options}
        onValueChange={val => setMode(val)}
        value={mode}>
        <Text>Select ML mode</Text>
      </RNPickerSelect>
      <ScrollView>
        <Text style={styles.text}>Results</Text>
        {results.map((result, index) => {
          return (
            <View style={styles.result}>
              <Text key={index}>{`Mode: ${result.mode}, architecutre: ${
                result.architecture
              }, time: ${result?.testTime || '10'}`}</Text>
              <Text>{`Frames detected by given time: ${
                result.results.length / result?.testTime || 10
              }`}</Text>
              <Text>{`Total frames: ${result.results.length}`}</Text>
              <Text>{`Total results: ${result.totalResults}`}</Text>
              <Text>{`Arithmetic mean: ${result.arithmeticallyFound}`}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  picker: {
    marginTop: 50,
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 30,
  },
  labelTextStyle: {
    textDecorationLine: 'none',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  result: {
    paddingBottom: 15,
  },
});
