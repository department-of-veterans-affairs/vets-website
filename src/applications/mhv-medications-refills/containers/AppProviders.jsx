import React from 'react';
import PropTypes from 'prop-types';

/**
 * AppProviders component wraps the application with necessary context providers
 * Currently a placeholder for user context and other providers as needed
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} props.user - User object from platform (unused for now)
 */
const AppProviders = ({ children, user: _user }) => {
  // In a full implementation, this would provide user context
  // For now, it's a passthrough wrapper
  return <>{children}</>;
};

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object,
};

export default AppProviders;
