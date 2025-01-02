import React from 'react';
import PropTypes from 'prop-types';
import { SectionContext, useSectionLevel } from '../../context/SectionContext';

const Section = ({ header, children, ...rest }) => {
  const currentLevel = useSectionLevel(); // Get the current header level
  const HeaderTag = `h${Math.min(currentLevel, 6)}`; // Limit to h6

  return (
    <SectionContext.Provider value={currentLevel + 1}>
      <div>
        <HeaderTag {...rest}>{header}</HeaderTag>
        <div>{children}</div>
      </div>
    </SectionContext.Provider>
  );
};

Section.propTypes = {
  header: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Section;
