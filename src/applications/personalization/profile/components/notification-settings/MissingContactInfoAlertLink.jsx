import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { showProfileLGBTQEnhancements } from '@@profile/selectors';
import { getContactInfoDeepLinkURL } from '@@profile/helpers';

import { FIELD_NAMES, MISSING_CONTACT_INFO } from '@@vap-svc/constants';

const MissingContactInfoAlertLink = ({
  missingInfo,
  shouldShowProfileLGBTQEnhancements,
}) => {
  const linkInfo = React.useMemo(
    () => {
      const linkMap = {
        [MISSING_CONTACT_INFO.ALL]: {
          linkText: 'Update your contact information',
          linkTarget: getContactInfoDeepLinkURL(
            'phoneNumbers',
            false,
            shouldShowProfileLGBTQEnhancements,
          ),
        },
        [MISSING_CONTACT_INFO.EMAIL]: {
          linkText: 'Add an email address to your profile',
          linkTarget: getContactInfoDeepLinkURL(
            FIELD_NAMES.EMAIL,
            true,
            shouldShowProfileLGBTQEnhancements,
          ),
        },
        [MISSING_CONTACT_INFO.MOBILE]: {
          linkText: 'Add a mobile phone number to your profile',
          linkTarget: getContactInfoDeepLinkURL(
            FIELD_NAMES.MOBILE_PHONE,
            true,
            shouldShowProfileLGBTQEnhancements,
          ),
        },
      };
      return linkMap[missingInfo];
    },
    [missingInfo, shouldShowProfileLGBTQEnhancements],
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

const mapStateToProps = state => ({
  shouldShowProfileLGBTQEnhancements: showProfileLGBTQEnhancements(state),
});

export default connect(mapStateToProps)(MissingContactInfoAlertLink);
