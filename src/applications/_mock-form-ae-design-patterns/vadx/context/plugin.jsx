import React from 'react';
import PropTypes from 'prop-types';

export const PluginContext = React.createContext();

export const PluginProvider = ({ children, plugin = {} }) => {
  return (
    <PluginContext.Provider value={{ plugin }}>
      {children}
    </PluginContext.Provider>
  );
};

PluginProvider.propTypes = {
  children: PropTypes.node.isRequired,
  plugin: PropTypes.object,
};
