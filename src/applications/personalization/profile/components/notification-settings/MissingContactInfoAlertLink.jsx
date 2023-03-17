import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FIELD_NAMES, MISSING_CONTACT_INFO } from '@@vap-svc/constants';

import { useContactInfoDeepLink } from '../../hooks';
import { PROFILE_PATHS } from '../../constants';

const MissingContactInfoAlertLink = ({ missingInfo }) => {
  const { generateContactInfoLink } = useContactInfoDeepLink();

  const linkInfo = useMemo(
    () => {
      const linkMap = {
        [MISSING_CONTACT_INFO.ALL]: {
          linkText: 'Update your contact information',
          linkTarget: generateContactInfoLink({
            fieldName: 'phoneNumbers',
            focusOnEditButton: false,
            returnPath: encodeURIComponent(PROFILE_PATHS.NOTIFICATION_SETTINGS),
          }),
        },
        [MISSING_CONTACT_INFO.EMAIL]: {
          linkText: 'Add an email address to your profile',
          linkTarget: generateContactInfoLink({
            fieldName: FIELD_NAMES.EMAIL,
            focusOnEditButton: true,
            returnPath: encodeURIComponent(PROFILE_PATHS.NOTIFICATION_SETTINGS),
          }),
        },
        [MISSING_CONTACT_INFO.MOBILE]: {
          linkText: 'Add a mobile phone number to your profile',
          linkTarget: generateContactInfoLink({
            fieldName: FIELD_NAMES.MOBILE_PHONE,
            focusOnEditButton: true,
            returnPath: encodeURIComponent(PROFILE_PATHS.NOTIFICATION_SETTINGS),
          }),
        },
      };
      return linkMap[missingInfo];
    },
    [missingInfo, generateContactInfoLink],
  );
  return (
    <Link to={linkInfo.linkTarget} data-testid="add-contact-info-link">
      <strong>{linkInfo.linkText}</strong>{' '}
      <i
        aria-hidden="true"
        className="fas fa-xs fa-chevron-right vads-u-margin-left--1"
      />
    </Link>
  );
};

MissingContactInfoAlertLink.propTypes = {
  missingInfo: PropTypes.string,
};

export default MissingContactInfoAlertLink;
