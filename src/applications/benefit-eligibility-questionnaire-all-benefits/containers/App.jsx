import React from 'react';
import PropTypes from 'prop-types';

export default function App({ children }) {
  return <div>{children}</div>;
}

App.propTypes = {
  children: PropTypes.node,
};
