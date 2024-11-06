import React from 'react';
import PropTypes from 'prop-types';

import { getMotionPreference, getElement, getElementPosition } from './utils';
import { scrollTo, scrollToTop } from './scroll';

export {
  getMotionPreference,
  getElement,
  getElementPosition,
  scrollTo,
  scrollToTop,
};

export const Element = ({ name, children = null }) => (
  <div name={name}>{children}</div>
);

Element.propTypes = {
  children: PropTypes.any,
  name: PropTypes.string,
};
