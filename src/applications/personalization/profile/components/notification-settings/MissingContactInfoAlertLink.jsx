import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { FIELD_NAMES, MISSING_CONTACT_INFO } from '@@vap-svc/constants';

import { useContactInfoDeepLink } from '../../hooks';
import { PROFILE_PATHS } from '../../constants';

const MissingContactInfoAlertLink = ({ missingInfo }) => {
  const { generateContactInfoLink } = useContactInfoDeepLink();

  const linkInfo = useMemo(
    () => {
      const linkMap = {
        [MISSING_CONTACT_INFO.EMAIL]: {
          linkText: 'Add an email address to your profile',
          linkTarget: generateContactInfoLink({
            fieldName: FIELD_NAMES.EMAIL,
            returnPath: encodeURIComponent(PROFILE_PATHS.NOTIFICATION_SETTINGS),
          }),
          linkTestId: 'add-email-address-link',
        },
        [MISSING_CONTACT_INFO.MOBILE]: {
          linkText: 'Add a phone number to your profile',
          linkTarget: generateContactInfoLink({
            fieldName: FIELD_NAMES.MOBILE_PHONE,
            returnPath: encodeURIComponent(PROFILE_PATHS.NOTIFICATION_SETTINGS),
          }),
          linkTestId: 'add-mobile-phone-link',
        },
      };
      return linkMap[missingInfo];
    },
    [missingInfo, generateContactInfoLink],
  );
  return (
    <va-link
      href={linkInfo.linkTarget}
      text={linkInfo.linkText}
      data-testid={linkInfo.linkTestId}
      active
    />
  );
};

MissingContactInfoAlertLink.propTypes = {
  missingInfo: PropTypes.string,
};

export default MissingContactInfoAlertLink;
