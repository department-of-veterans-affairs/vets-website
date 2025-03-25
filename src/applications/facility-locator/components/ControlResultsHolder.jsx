import React from 'react';
import PropTypes from 'prop-types';

function ControlResultsHolder({ children, isSmallDesktop }) {
  // If the screen is smaller than small desktop we just return the children
  if (!isSmallDesktop) {
    return children;
  }

  return (
    <div
      data-testid="vertical-oriented-left-controls"
      id="vertical-oriented-left-controls"
    >
      {children}
    </div>
  );
}

ControlResultsHolder.propTypes = {
  children: PropTypes.node.isRequired,
  isSmallDesktop: PropTypes.bool.isRequired,
};

export default ControlResultsHolder;
