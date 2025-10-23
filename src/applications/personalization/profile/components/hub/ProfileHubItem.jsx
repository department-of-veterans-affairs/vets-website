import React from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const ProfileHubItem = ({ heading, content, href }) => {
  return (
    <div className="vads-u-margin-y--4">
      <VaLink
        className="vads-u-margin--0 vads-u-font-size--sans-lg vads-u-font-weight--bold"
        href={href}
        text={heading}
      />
      <p className="vads-u-margin-top--0">{content}</p>
    </div>
  );
};

ProfileHubItem.propTypes = {
  content: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};
