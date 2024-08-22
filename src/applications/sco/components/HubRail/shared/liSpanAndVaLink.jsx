import React from 'react';
import PropTypes from 'prop-types';

const LiSpanAndVaLink = ({ href, hrefText }) => (
  <li>
    <va-link href={href} text={hrefText} uswds />
  </li>
);

LiSpanAndVaLink.propTypes = {
  href: PropTypes.string.isRequired,
  hrefText: PropTypes.string.isRequired,
};

export default LiSpanAndVaLink;
