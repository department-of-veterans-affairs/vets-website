import React from 'react';
import PropTypes from 'prop-types';

const LiVaIconAndVaLink = ({ href, text, iconName }) => (
  <li className="vads-u-margin-bottom--2 vads-u-margin-top--0">
    <va-icon
      className="vads-u-color--link-default vads-u-margin-right--0p5 hydrated"
      icon={iconName}
      size="3"
      uswds
    />
    <va-link href={`${href}#facebook`} text={text} uswds />
  </li>
);

LiVaIconAndVaLink.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  iconName: PropTypes.any.isRequired,
};

export default LiVaIconAndVaLink;
