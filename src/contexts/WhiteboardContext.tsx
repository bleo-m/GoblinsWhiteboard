import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import Papa from 'papaparse';

export interface Whiteboard {
  id: string;
  image_url: string;
}

interface WhiteboardContextType {
  whiteboards: Whiteboard[];
  setWhiteboards: React.Dispatch<React.SetStateAction<Whiteboard[]>>;
}

interface WhiteBoardContextProps {
  children: ReactNode;
}

const WhiteboardContext = createContext<WhiteboardContextType | undefined>(
  undefined,
);

export const useWhiteboardContext = (): WhiteboardContextType => {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error(
      'useWhiteboardContext must be used within a WhiteboardProvider',
    );
  }
  return context;
};

export const WhiteboardProvider = ({ children }: WhiteBoardContextProps) => {
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);

  useEffect(() => {
    // Load the CSV once and store the data in state
    const loadCSVData = async () => {
      const response = await fetch('/whiteboards.csv');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const result = await reader?.read();
      const csvText = decoder.decode(result?.value);

      // Parse the CSV text
      Papa.parse(csvText, {
        complete: (parsedData) => {
          const data = parsedData.data as Whiteboard[];
          // Ignore the last row (footer)
          const filteredData = data.slice(0, -1);
          setWhiteboards(filteredData);
        },
        header: true,
      });
    };

    loadCSVData();
  }, []);

  return (
    <WhiteboardContext.Provider value={{ whiteboards, setWhiteboards }}>
      {children}
    </WhiteboardContext.Provider>
  );
};
