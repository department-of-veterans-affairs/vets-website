import React from 'react';
import PropTypes from 'prop-types';

import {
  getElement,
  getElementPosition,
  getMotionPreference,
  getPageYPosition,
  getScrollOptions,
} from './utils';
import {
  scrollTo,
  scrollToTop,
  scrollToElement,
  scrollToFirstError,
  scrollAndFocus,
  customScrollAndFocus,
} from './scroll';
import { watchErrorUpdates } from './error-scaffolding';
import { SCROLL_ELEMENT_SUFFIX } from '../constants';

/**
 * This scroll module is used to scroll to elements on the page without using
 * React scroll library.
 */

export {
  getElement,
  getElementPosition,
  getMotionPreference,
  getPageYPosition,
  getScrollOptions,
  scrollTo,
  scrollToTop,
  scrollToElement,
  scrollToFirstError,
  scrollAndFocus,
  customScrollAndFocus,
  watchErrorUpdates,
  SCROLL_ELEMENT_SUFFIX,
};

export const Element = ({ name, children = null }) => (
  <div name={name}>{children}</div>
);

Element.propTypes = {
  children: PropTypes.any,
  name: PropTypes.string,
};
