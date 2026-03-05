import React from 'react';
import PropTypes from 'prop-types';
import { isMinimalHeaderPath } from 'platform/forms-system/src/js/patterns/minimal-header';

export const DefaultCardHeader = ({ level = '3' }) => {
  const isMinimalHeader = isMinimalHeaderPath();
  const HeaderTag = isMinimalHeader ? 'h2' : `h4`;
  const cardHeaderLevel = isMinimalHeader ? '3' : level;

  return (
    <HeaderTag
      className={`vads-u-margin-top--0 vads-u-font-size--h${cardHeaderLevel}`}
    >
      Personal information
    </HeaderTag>
  );
};

DefaultCardHeader.propTypes = {
  level: PropTypes.string,
};
