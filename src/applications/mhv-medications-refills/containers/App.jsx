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
  return <div>{children}</div>;
};

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
