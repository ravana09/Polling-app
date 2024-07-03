import React, { createContext, useState } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timer, setTimer] = useState(true);
  const [trend, setTrend] = useState({});


  return (
    <TimerContext.Provider value={{ timer, setTimer }}>
      {children}
    </TimerContext.Provider>
  );
};
