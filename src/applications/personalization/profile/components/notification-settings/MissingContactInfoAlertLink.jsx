import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getContactInfoDeepLinkURL } from '@@profile/helpers';

import { FIELD_NAMES, MISSING_CONTACT_INFO } from '@@vap-svc/constants';

const MissingContactInfoAlertLink = ({ missingInfo }) => {
  const linkInfo = React.useMemo(
    () => {
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
      return linkMap[missingInfo];
    },
    [missingInfo],
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
  missingInfo: PropTypes.shape({
    linkTarget: PropTypes.string,
    linkText: PropTypes.string,
  }),
};

export default MissingContactInfoAlertLink;
