import React from 'react';
import PropTypes from 'prop-types';

const LiVaIconAndVaLink = ({ href, text, iconName }) => (
  <li>
    <va-link href={`${href}#facebook`} text={text} icon-name={iconName} />
  </li>
);

LiVaIconAndVaLink.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  iconName: PropTypes.any.isRequired,
};

export default LiVaIconAndVaLink;
