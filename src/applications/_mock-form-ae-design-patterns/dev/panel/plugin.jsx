import React from 'react';

export const PluginContext = React.createContext();

export const PluginProvider = ({ children, plugin }) => {
  return (
    <PluginContext.Provider value={{ plugin }}>
      {children}
    </PluginContext.Provider>
  );
};
