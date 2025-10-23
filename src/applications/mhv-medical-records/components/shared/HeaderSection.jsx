import React from 'react';
import PropTypes from 'prop-types';
import {
  HeaderSectionContext,
  useSectionLevel,
} from '../../context/HeaderSectionContext';

const HeaderSection = ({ header, children, ...rest }) => {
  const currentLevel = useSectionLevel(); // Get the current header level
  const HeaderTag = `h${Math.min(currentLevel, 6)}`; // Limit to h6

  return (
    <HeaderSectionContext.Provider value={currentLevel + 1}>
      <div>
        <HeaderTag {...rest}>{header}</HeaderTag>
        <div>{children}</div>
      </div>
    </HeaderSectionContext.Provider>
  );
};

HeaderSection.propTypes = {
  header: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default HeaderSection;
