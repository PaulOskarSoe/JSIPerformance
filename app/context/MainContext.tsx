import React, {createContext, FC, useState} from 'react';

export type MLMode = 'image_label' | 'barcode_scan' | 'text_regocnizition';

interface IMainContext {
  mode: MLMode;
  setMode: React.Dispatch<React.SetStateAction<MLMode>>;
}

export const MainContext = createContext<IMainContext>({
  mode: 'image_label',
  setMode: () => null,
});

const MainContextProvider: FC = ({children}) => {
  const [mode, setMode] = useState<MLMode>('image_label');

  return (
    <MainContext.Provider value={{mode, setMode}}>
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
