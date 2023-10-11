import React from 'react';
import PropTypes from 'prop-types';

export default function RepresentativeApp({ children }) {
  return (
    <>
      <div>{children}</div>
    </>
  );
}

RepresentativeApp.propTypes = {
  children: PropTypes.node.isRequired,
};
