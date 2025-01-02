import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const SectionContext = createContext(1);

export const SectionProvider = ({ children }) => (
  <SectionContext.Provider value={1}>{children}</SectionContext.Provider>
);

SectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSectionLevel = () => {
  const level = useContext(SectionContext);
  if (level === undefined) {
    throw new Error('useSectionLevel must be used within a SectionProvider');
  }
  return level;
};
