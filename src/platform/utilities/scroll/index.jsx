import React from 'react';
import PropTypes from 'prop-types';

export const Element = ({ name, children = null }) => (
  <div name={name}>{children}</div>
);

Element.propTypes = {
  children: PropTypes.any,
  name: PropTypes.string,
};
