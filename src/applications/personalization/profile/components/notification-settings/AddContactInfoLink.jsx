import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getContactInfoDeepLinkURL } from '@@profile/helpers';
import { showProfileLGBTQEnhancements } from '@@profile/selectors';

import { FIELD_NAMES, MISSING_CONTACT_INFO } from '@@vap-svc/constants';

const AddContactInfoLink = ({
  missingInfo,
  shouldShowProfileLGBTQEnhancements,
}) => {
  const linkInfo = React.useMemo(
    () => {
      const linkMap = {
        [MISSING_CONTACT_INFO.EMAIL]: {
          linkText: 'Add your email address',
          linkTarget: getContactInfoDeepLinkURL(
            FIELD_NAMES.EMAIL,
            true,
            shouldShowProfileLGBTQEnhancements,
          ),
        },
        [MISSING_CONTACT_INFO.MOBILE]: {
          linkText: 'Add your mobile phone number',
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
  return <Link to={linkInfo.linkTarget}>{linkInfo.linkText}</Link>;
};

const mapStateToProps = state => ({
  shouldShowProfileLGBTQEnhancements: showProfileLGBTQEnhancements(state),
});

export default connect(mapStateToProps)(AddContactInfoLink);
