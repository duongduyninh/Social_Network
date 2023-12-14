import { createContext, useCallback, useEffect, useState } from 'react';

const DetectContext = createContext({});

export const DetectProvider = ({ children }) => {
  const [element, setElement] = useState({
    target: undefined,
  });
  const handleSetElement = (el) => {
    setElement((prev) => {
      return {
        target: el,
      };
    });
  };
  const detect = useCallback((e) => {
    e.stopPropagation();
    const target = e.target;
    setElement({
      target,
    });
  }, []);
  const handleRemoveEvent = () => {
    document.removeEventListener('click', detect);
  };
  useEffect(() => {
    document.addEventListener('click', detect);
    return () => document.removeEventListener('click', detect);
  }, []);

  return (
    <DetectContext.Provider value={{ element: element?.target, handleSetElement, handleRemoveEvent }}>
      {children}
    </DetectContext.Provider>
  );
};

export default DetectContext;
