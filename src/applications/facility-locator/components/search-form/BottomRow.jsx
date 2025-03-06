import React from 'react';
import PropTypes from 'prop-types';

function BottomRow({ isSmallDesktop, children }) {
  if (isSmallDesktop) {
    return <div id="search-controls-bottom-row">{children}</div>;
  }
  return children;
}

BottomRow.propTypes = {
  children: PropTypes.node.isRequired,
  isSmallDesktop: PropTypes.bool,
};

export default BottomRow;
