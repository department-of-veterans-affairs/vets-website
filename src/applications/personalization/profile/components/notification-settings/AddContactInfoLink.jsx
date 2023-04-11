import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getContactInfoDeepLinkURL } from '@@profile/helpers';

import { FIELD_NAMES, MISSING_CONTACT_INFO } from '@@vap-svc/constants';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

const AddContactInfoLink = ({ missingInfo }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const useEditingPage = useToggleValue(
    TOGGLE_NAMES.profileUseFieldEditingPage,
  );
  const linkInfo = React.useMemo(
    () => {
      const linkMap = {
        [MISSING_CONTACT_INFO.EMAIL]: {
          linkText: 'Add your email address',
          linkTarget: getContactInfoDeepLinkURL(
            FIELD_NAMES.EMAIL,
            true,
            useEditingPage,
          ),
        },
        [MISSING_CONTACT_INFO.MOBILE]: {
          linkText: 'Add your mobile phone number',
          linkTarget: getContactInfoDeepLinkURL(
            FIELD_NAMES.MOBILE_PHONE,
            true,
            useEditingPage,
          ),
        },
      };

      return linkMap[missingInfo];
    },
    [missingInfo, useEditingPage],
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
