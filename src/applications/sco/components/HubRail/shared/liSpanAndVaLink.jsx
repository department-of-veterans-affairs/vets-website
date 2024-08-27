import React from 'react';
import PropTypes from 'prop-types';

const LiSpanAndVaLink = ({ href, hrefText, download }) => (
  <li>
    <va-link href={href} text={hrefText} uswds download={download} />
  </li>
);

LiSpanAndVaLink.propTypes = {
  href: PropTypes.string.isRequired,
  hrefText: PropTypes.string.isRequired,
};

export default LiSpanAndVaLink;
