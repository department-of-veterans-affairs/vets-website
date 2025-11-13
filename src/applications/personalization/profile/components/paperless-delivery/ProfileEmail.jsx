import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { useContactInfoDeepLink } from '../../hooks';
import { PROFILE_PATHS } from '../../constants';

export const ProfileEmail = ({ emailAddress }) => {
  const { generateContactInfoLink } = useContactInfoDeepLink();

  return (
    <ul className="vads-u-margin-y--3">
      <li className="vads-u-margin-y--0p5">
        <span className="vads-u-font-weight--bold">Email address:</span>{' '}
        {emailAddress && `${emailAddress} `}
        <Link
          data-testid="email-address-on-file"
          to={generateContactInfoLink({
            fieldName: FIELD_NAMES.EMAIL,
            returnPath: encodeURIComponent(PROFILE_PATHS.PAPERLESS_DELIVERY),
          })}
          className="vads-u-display--block medium-screen:vads-u-display--inline vads-u-margin-bottom--1p5 medium-screen:vads-u-margin-bottom--0 medium-screen:vads-u-margin-left--1"
        >
          {emailAddress
            ? 'Update your email address'
            : 'Add your email address to your profile'}
        </Link>
      </li>
    </ul>
  );
};

ProfileEmail.propTypes = {
  emailAddress: PropTypes.string,
};
