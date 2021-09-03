import React from 'react';
import { Link } from 'react-router-dom';

import { PROFILE_PATHS } from '../../constants';

export const MISSING_CONTACT_INFO = {
  ALL: 'ALL',
  EMAIL: 'EMAIL',
  MOBILE: 'MOBILE',
};

const linkMap = {
  [MISSING_CONTACT_INFO.ALL]: {
    linkText: 'Update your contact information',
    linkTarget: `${PROFILE_PATHS.PERSONAL_INFORMATION}#phone-numbers`,
  },
  [MISSING_CONTACT_INFO.EMAIL]: {
    linkText: 'Add an email address to your profile',
    linkTarget: `${
      PROFILE_PATHS.PERSONAL_INFORMATION
    }#edit-contact-email-address`,
  },
  [MISSING_CONTACT_INFO.MOBILE]: {
    linkText: 'Add a mobile phone number to your profile',
    linkTarget: `${
      PROFILE_PATHS.PERSONAL_INFORMATION
    }#edit-mobile-phone-number`,
  },
};

const AddContactInfoLink = ({ missingInfo }) => {
  const linkInfo = React.useMemo(
    () => {
      return linkMap[missingInfo];
    },
    [missingInfo],
  );
  return (
    <Link to={linkInfo.linkTarget}>
      <strong>{linkInfo.linkText}</strong>{' '}
      <i
        aria-hidden="true"
        className="fas fa-xs fa-chevron-right vads-u-margin-left--1"
      />
    </Link>
  );
};

export default AddContactInfoLink;
