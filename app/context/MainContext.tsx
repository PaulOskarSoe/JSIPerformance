import React, {createContext, FC, useCallback, useState} from 'react';

export type Architectures = 'jsi' | 'bridge';

export type MLMode = 'barcode_scan' | 'text_regocnizition' | 'face_detection';

export interface TestResults {
  [key: string]: ResultParameters[];
}

export interface ResultParameters {
  detected_by_frame: DetectedByFrame;
}

export interface DetectedByFrame {
  [Key: number]: number;
}

export interface ModeTestResults {
  [key: string]: TestResults;
}

interface IMainContext {
  testResults: ModeTestResults;
  mode?: MLMode;
  jsiResults: TestResults | undefined;
  testTime: number;
  bridgeResults: TestResults | undefined;
  labelResult: boolean;
  setLabelResult: React.Dispatch<React.SetStateAction<boolean>>;
  setTestTime: React.Dispatch<React.SetStateAction<number>>;
  setTestResults: React.Dispatch<React.SetStateAction<ModeTestResults>>;
  setMode: React.Dispatch<React.SetStateAction<MLMode | undefined>>;
  updateTestResults: IUpdateTestResults;
}

interface IUpdateTestResults {
  (
    architecture: Architectures,
    mlMode: string,
    result: ResultParameters[],
  ): void;
}

export const MainContext = createContext<IMainContext>({
  jsiResults: undefined,
  bridgeResults: undefined,
  testTime: 10,
  testResults: {},
  mode: undefined,
  labelResult: false,
  setLabelResult: () => null,
  setTestTime: () => null,
  setTestResults: () => null,
  setMode: () => null,
  updateTestResults: () => null,
});

const MainContextProvider: FC = ({children}) => {
  const [mode, setMode] = useState<MLMode | undefined>(undefined);
  const [testResults, setTestResults] = useState<ModeTestResults>({});
  const [jsiResults, setJsiResults] = useState<TestResults | undefined>();
  const [bridgeResults, setBridgeResults] = useState<TestResults | undefined>();
  const [testTime, setTestTime] = useState<number>(10);
  const [labelResult, setLabelResult] = useState<boolean>(false);

  const updateTestResults = useCallback<IUpdateTestResults>(
    (
      architecture: Architectures,
      mlMode: string,
      result: ResultParameters[],
    ) => {
      if (architecture === 'bridge') {
        setBridgeResults(currBridgeResult => ({
          ...currBridgeResult,
          [mlMode]: result,
        }));
      } else if (architecture === 'jsi') {
        setJsiResults(currBridgeResult => ({
          ...currBridgeResult,
          [mlMode]: result,
        }));
      }
    },
    [],
  );

  const resetResults = useCallback(() => {
    setTestResults({});
  }, []);

  const functions = {
    setMode,
    setTestResults,
    updateTestResults,
    resetResults,
    setTestTime,
    setLabelResult,
  };

  const values = {
    labelResult,
    jsiResults,
    bridgeResults,
    mode,
    testResults,
    testTime,
  };

  return (
    <MainContext.Provider value={{...functions, ...values}}>
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
