import React from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const LinkWithDescription = ({ text, description }) => (
  <div className="vads-u-flex--1 site-grid-example">
    <VaLink
      active
      className="vads-u-font-weight--bold vads-u-font-family--serif"
      text={text}
      href="#"
    />
    <p className="vads-u-margin-top--1p5 vads-u-font-family--sans vads-u-color--gray-dark">
      {description}
    </p>
  </div>
);

LinkWithDescription.propTypes = {
  description: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default LinkWithDescription;
