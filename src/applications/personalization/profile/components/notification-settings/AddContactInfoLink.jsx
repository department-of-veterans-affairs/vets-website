import React from 'react';
import { Link } from 'react-router-dom';

import { PROFILE_PATHS } from '../../constants';

const linkMap = {
  ALL: {
    linkText: 'update your contact information',
    linkTarget: `${PROFILE_PATHS.PERSONAL_INFORMATION}#phone-numbers`,
  },
  EMAIL: {
    linkText: 'add your email address to your profile',
    linkTarget: `${
      PROFILE_PATHS.PERSONAL_INFORMATION
    }#edit-contact-email-address`,
  },
  MOBILE: {
    linkText: 'add your mobile phone number to your profile',
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

AddContactInfoLink.ALL = 'ALL';
AddContactInfoLink.EMAIL = 'EMAIL';
AddContactInfoLink.MOBILE = 'MOBILE';

export default AddContactInfoLink;
