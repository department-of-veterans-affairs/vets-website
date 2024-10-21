import React from 'react';
import PropTypes from 'prop-types';

const LiSpanAndVaLinkAndPTag = ({ href, hrefText, pText }) => (
  <li>
    <va-link href={href} text={hrefText} uswds />
    <p className="va-nav-linkslist-description">{pText}</p>
  </li>
);

LiSpanAndVaLinkAndPTag.propTypes = {
  href: PropTypes.string.isRequired,
  hrefText: PropTypes.string.isRequired,
  pText: PropTypes.string.isRequired,
};

export default LiSpanAndVaLinkAndPTag;
