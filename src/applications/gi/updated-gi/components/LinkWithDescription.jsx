import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LinkWithDescription = ({ text, link, description }) => (
  <div className="vads-u-flex--1 site-grid-example">
    <Link
      className="comparison-tool-link vads-u-font-weight--bold vads-u-font-family--serif"
      to={link}
    >
      {text}
    </Link>
    <p className="vads-u-margin-top--1p5 vads-u-font-family--sans vads-u-color--gray-dark">
      {description}
    </p>
  </div>
);

LinkWithDescription.propTypes = {
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default LinkWithDescription;
