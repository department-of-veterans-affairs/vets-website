import React from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory } from 'react-router-dom';
import { handleRouteChange } from '../../helpers';

export const ProfileHubItem = ({
  heading,
  content,
  href,
  reactLink = false,
}) => {
  const history = useHistory();

  const props = {
    href,
    text: heading,
    onClick: reactLink ? event => handleRouteChange(event, history) : undefined,
    role: 'link',
  };

  return (
    <div className="vads-u-margin-y--4">
      <VaLink
        className="vads-u-margin--0 vads-u-font-size--sans-lg vads-u-font-weight--bold"
        {...props}
      />
      <p className="vads-u-margin-top--0">{content}</p>
    </div>
  );
};

ProfileHubItem.propTypes = {
  content: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  reactLink: PropTypes.bool,
};
