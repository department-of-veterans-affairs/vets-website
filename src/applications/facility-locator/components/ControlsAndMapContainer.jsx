import React from 'react';
import PropTypes from 'prop-types';

function ControlsAndMapContainer({ children, isSmallDesktop }) {
  // If the screen is smaller than small desktop we just return the children
  if (!isSmallDesktop) {
    return children;
  }

  return <div id="controls-and-map-container">{children}</div>;
}

ControlsAndMapContainer.propTypes = {
  children: PropTypes.node.isRequired,
  isSmallDesktop: PropTypes.bool.isRequired,
};

export default ControlsAndMapContainer;
