import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getContactEditLinkURL } from '@@profile/helpers';

import { FIELD_NAMES, MISSING_CONTACT_INFO } from '@@vap-svc/constants';

const AddContactInfoLink = ({ missingInfo }) => {
  const linkInfo = React.useMemo(
    () => {
      const linkMap = {
        [MISSING_CONTACT_INFO.EMAIL]: {
          linkText: 'Add your email address',
          linkTarget: getContactEditLinkURL(FIELD_NAMES.EMAIL),
        },
        [MISSING_CONTACT_INFO.MOBILE]: {
          linkText: 'Add your mobile phone number',
          linkTarget: getContactEditLinkURL(FIELD_NAMES.MOBILE_PHONE),
        },
      };

      return linkMap[missingInfo];
    },
    [missingInfo],
  );
  return <Link to={linkInfo.linkTarget}>{linkInfo.linkText}</Link>;
};

AddContactInfoLink.propTypes = {
  missingInfo: PropTypes.shape({
    linkTarget: PropTypes.string,
    linkText: PropTypes.string,
  }),
};

export default AddContactInfoLink;
