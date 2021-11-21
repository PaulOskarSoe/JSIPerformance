import React, {createContext, FC, useState} from 'react';

export type MLMode =
  | 'image_label'
  | 'barcode_scan'
  | 'text_regocnizition'
  | 'face_detection';

export interface TestResults {
  sum_in_ten_seconds: number;
}

export interface ModeTestResults {
  [key: string]: TestResults;
}

interface IMainContext {
  testResults: ModeTestResults;
  mode: MLMode;
  setTestResults: React.Dispatch<React.SetStateAction<ModeTestResults>>;
  setMode: React.Dispatch<React.SetStateAction<MLMode>>;
}

export const MainContext = createContext<IMainContext>({
  testResults: {},
  mode: 'image_label',
  setTestResults: () => null,
  setMode: () => null,
});

const MainContextProvider: FC = ({children}) => {
  const [mode, setMode] = useState<MLMode>('barcode_scan');
  const [testResults, setTestResults] = useState<ModeTestResults>({});

  const functions = {
    setMode,
    setTestResults,
  };

  const values = {
    mode,
    testResults,
  };

  return (
    <MainContext.Provider value={{...functions, ...values}}>
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
