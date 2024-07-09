import React from 'react';
import PropTypes from 'prop-types';

const LiVaLink = ({ href, text }) => (
  <li className="vads-u-margin-bottom--0 vads-u-margin-top--0">
    <va-link href={href} text={text} />
  </li>
);

LiVaLink.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default LiVaLink;
