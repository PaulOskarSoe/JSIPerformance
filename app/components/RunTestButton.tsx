import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {runOnJS, useAnimatedReaction} from 'react-native-reanimated';
import {
  Architectures,
  MainContext,
  ResultParameters,
} from '../context/MainContext';
import {storage} from '../jsiStorage';

interface IRunTestButtonProps {
  architecture: Architectures;
  onRunTest: () => void;
  testResults: any;
}

const RunTestButton: FC<IRunTestButtonProps> = ({
  onRunTest,
  testResults,
  architecture,
}) => {
  const {mode, updateTestResults, testTime} = useContext(MainContext);
  const [testRunning, setTestRunning] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(testTime); // default value is 10, maybe in future let user to set testing interval?
  const [results, setResults] = useState<ResultParameters[]>([]);
  const [nullResults, setNullResults] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  const onResultsDetected = useCallback((newResults: any) => {
    if (newResults && newResults.length) {
      setResults(currResults => [
        ...currResults,
        {detected_by_frame: newResults.length},
      ]);
    } else {
      setNullResults(currVal => currVal + 1);
    }
    setTotalResults(x => x + 1);
  }, []);

  // get value from UI thread and runResults on JS for testing purposes
  useAnimatedReaction(
    () => {
      return testResults.value;
    },
    testingResults => {
      if (testRunning) {
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
    const finishTest = async () => {
      if (remainingSeconds <= 0 && mode) {
        setTestRunning(false);
        setRemainingSeconds(testTime);

        updateTestResults(architecture, mode as string, results);
        storage.set(
          JSON.stringify(new Date()),
          JSON.stringify({
            architecture,
            testTime,
            mode,
            results,
            created_at: new Date(),
            nullResults: nullResults,
            totalResults,
          }),
        );
      }
    };

    finishTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds, testTime]);

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
