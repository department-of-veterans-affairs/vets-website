import React from 'react';
import { Link } from 'react-router-dom';

import { PROFILE_PATHS } from '../../constants';

export const MISSING_CONTACT_INFO = {
  EMAIL: 'EMAIL',
  MOBILE: 'MOBILE',
};

const linkMap = {
  [MISSING_CONTACT_INFO.EMAIL]: {
    linkText: 'Add your email address',
    linkTarget: `${
      PROFILE_PATHS.PERSONAL_INFORMATION
    }#edit-contact-email-address`,
  },
  [MISSING_CONTACT_INFO.MOBILE]: {
    linkText: 'Add your mobile phone number',
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
  return <Link to={linkInfo.linkTarget}>{linkInfo.linkText}</Link>;
};

export default AddContactInfoLink;
