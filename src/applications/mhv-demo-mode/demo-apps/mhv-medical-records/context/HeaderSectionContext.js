import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const HeaderSectionContext = createContext(1);

export const HeaderSectionProvider = ({ children }) => (
  <HeaderSectionContext.Provider value={1}>
    {children}
  </HeaderSectionContext.Provider>
);

HeaderSectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSectionLevel = () => {
  const level = useContext(HeaderSectionContext);
  if (level === undefined) {
    throw new Error(
      'useSectionLevel must be used within a HeaderSectionProvider',
    );
  }
  return level;
};
