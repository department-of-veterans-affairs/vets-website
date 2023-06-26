import React from 'react';
import PropTypes from 'prop-types';

export default function App({ children }) {
  return (
    <>
      <h1>AVS</h1>
      <div>{children}</div>
    </>
  );
}

App.propTypes = {
  children: PropTypes.node,
};
