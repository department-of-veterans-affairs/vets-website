import React from 'react';
import PropTypes from 'prop-types';

import { Error400 } from './Error400';
import { Error500 } from './Error500';

export const RenderError = ({ error, introPage }) => {
  let content = null;

  if (error && error >= 500) {
    content = <Error500 />;
  } else {
    // If it is any other kind of error
    content = <Error400 introPage={introPage} />;
  }

  return content ? (
    <div className="vads-u-margin-bottom--5">{content}</div>
  ) : null;
};

RenderError.propTypes = {
  error: PropTypes.number,
  introPage: PropTypes.bool,
};
