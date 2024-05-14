import React from 'react';
import PropTypes from 'prop-types';

export const OnThisPageLink = ({ link, text }) => {
  return (
    <a className="arrow-down-link" href={link}>
      <p>
        <span className="icon-with-info">
          <i
            className="fa fa-arrow-down vads-u-padding-right--1"
            aria-hidden="true"
          />
          {text}
        </span>
      </p>
    </a>
  );
};

OnThisPageLink.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string,
};
