import React from 'react';
import { Link } from 'react-router-dom';

import { getContactInfoDeepLinkURL } from '@@profile/helpers';

import { FIELD_NAMES } from '@@vap-svc/constants';

export const MISSING_CONTACT_INFO = {
  EMAIL: 'EMAIL',
  MOBILE: 'MOBILE',
};

const linkMap = {
  [MISSING_CONTACT_INFO.EMAIL]: {
    linkText: 'Add your email address',
    linkTarget: getContactInfoDeepLinkURL(FIELD_NAMES.EMAIL, true),
  },
  [MISSING_CONTACT_INFO.MOBILE]: {
    linkText: 'Add your mobile phone number',
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
  return <Link to={linkInfo.linkTarget}>{linkInfo.linkText}</Link>;
};

export default AddContactInfoLink;
