import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {runOnJS, useAnimatedReaction} from 'react-native-reanimated';
import {MainContext} from '../context/MainContext';

interface IRunTestButtonProps {
  onRunTest: () => void;
  testResults: any;
}

const RunTestButton: FC<IRunTestButtonProps> = ({onRunTest, testResults}) => {
  const {setTestResults} = useContext(MainContext);
  const [testRunning, setTestRunning] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(10); // default value is 10, maybe in future let user to set testing interval?
  const [results, setResults] = useState<any[]>([]);

  const onResultsDetected = useCallback((newResults: any) => {
    setResults(currResults => [...currResults, ...newResults]);
  }, []);

  // get value from UI thread and runResults on JS for testing purposes
  useAnimatedReaction(
    () => {
      return testResults.value;
    },
    testingResults => {
      if (testRunning && testingResults.length) {
        runOnJS(onResultsDetected)(testingResults);
      }
    },
  );

  // interval which will reduce seconds count by one in every second
  useEffect(() => {
    const interval = setInterval(() => {
      testRunning && setRemainingSeconds(currentSeconds => currentSeconds - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [testRunning]);

  // if seconds get reduced to 0, then test has been completed
  useEffect(() => {
    if (remainingSeconds <= 0) {
      setTestRunning(false);
      setRemainingSeconds(10);
      setResults([]);
      setTestResults(currResults => ({
        ...currResults,
        ['barcode_scan']: {sum_in_ten_seconds: results.length},
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, setTestResults]);

  const onPress = () => {
    onRunTest();
    setTestRunning(true);
  };

  if (testRunning) {
    return (
      <View style={styles.container}>
        <Text>{`Seconds: ${remainingSeconds}`}</Text>
        <Text>{`Results: ${results.length ?? 0}`}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}>
      <Text style={styles.runTestText}>Run test</Text>
    </TouchableOpacity>
  );
};

export default RunTestButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    right: 20,
    bottom: 20,
    padding: 20,
    borderRadius: 20,
  },
  runTestText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
