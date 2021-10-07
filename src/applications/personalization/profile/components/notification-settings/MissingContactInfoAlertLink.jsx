import React from 'react';
import { Link } from 'react-router-dom';

import { getContactInfoDeepLinkURL } from '@@profile/helpers';

import { FIELD_NAMES } from '@@vap-svc/constants';

export const MISSING_CONTACT_INFO = {
  ALL: 'ALL',
  EMAIL: 'EMAIL',
  MOBILE: 'MOBILE',
};

const linkMap = {
  [MISSING_CONTACT_INFO.ALL]: {
    linkText: 'Update your contact information',
    linkTarget: getContactInfoDeepLinkURL('phoneNumbers', false),
  },
  [MISSING_CONTACT_INFO.EMAIL]: {
    linkText: 'Add an email address to your profile',
    linkTarget: getContactInfoDeepLinkURL(FIELD_NAMES.EMAIL, true),
  },
  [MISSING_CONTACT_INFO.MOBILE]: {
    linkText: 'Add a mobile phone number to your profile',
    linkTarget: getContactInfoDeepLinkURL(FIELD_NAMES.MOBILE_PHONE, true),
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
