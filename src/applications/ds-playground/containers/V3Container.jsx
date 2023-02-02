/**
 * This container is setup to contain and display USWDS V3-compatible Web Components
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function V3Container({ children }) {
  return (
    <div className="vads-u-flex--fill vads-u-display--flex vads-u-justify-content--center">
      {children}
    </div>
  );
}

V3Container.propTypes = {
  children: PropTypes.object,
};
