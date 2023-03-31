import React from 'react';
import PropTypes from 'prop-types';

export const EditContainer = ({ children }) => {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--0">
      <div className="vads-l-row">
        <div className="vads-l-col--12 vads-u-padding-bottom--4 vads-u-padding-x--1 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--6 small-desktop-screen:vads-l-col--8">
          {/* children will be passed in from React Router one level up */}
          {children}
        </div>
      </div>
    </div>
  );
};

EditContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
