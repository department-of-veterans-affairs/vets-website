import React from 'react';
import PropTypes from 'prop-types';

/**
 * App container component
 * Provides consistent layout wrapper for all pages in the application
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components (pages)
 */
const App = ({ children }) => {
  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 large-screen:vads-u-padding-x--2">
      <div className="vads-l-row">
        <div className="vads-l-col--12">{children}</div>
      </div>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
