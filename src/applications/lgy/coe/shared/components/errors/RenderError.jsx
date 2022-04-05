import React from 'react';
import PropTypes from 'prop-types';

import { Error400 } from './Error400';
import { Error500 } from './Error500';

export const RenderError = ({ error }) => {
  if (error && error >= 500) {
    return <Error500 />;
  }

  // If it is any other kind of error
  return <Error400 />;
};

RenderError.propTypes = {
  error: PropTypes.number,
};
