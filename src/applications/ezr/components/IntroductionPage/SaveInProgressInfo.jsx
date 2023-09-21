import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { selectAuthStatus } from '../../utils/selectors/auth-status';
import VerifiedPrefillAlert from '../FormAlerts/VerifiedPrefillAlert';
import content from '../../locales/en/content.json';

const SaveInProgressInfo = ({ formConfig, pageList }) => {
  const { isLoggedOut } = useSelector(selectAuthStatus);
  const {
    downtime,
    prefillEnabled,
    savedFormMessages,
    customText,
  } = formConfig;

  // set the props to use for the SaveInProgressIntro components
  const sipProps = {
    startText: content['sip-start-form'],
    messages: savedFormMessages,
    formConfig: { customText },
    headingLevel: 3,
    verifiedPrefillAlert: VerifiedPrefillAlert,
    buttonOnly: isLoggedOut,
    prefillEnabled,
    downtime,
    pageList,
  };

  return isLoggedOut ? (
    <>
      <va-alert status="info" uswds>
        <h3 slot="headline">{content['sip-alert-title']}</h3>
        <div>
          <ul className="vads-u-margin-top--0">
            <li>
              We can fill in some of your information for you to save you time.
            </li>
            <li>
              You can save your work in progress. You’ll have 60 days from when
              you start or make updates to your application to come back and
              finish it.
            </li>
          </ul>
          <SaveInProgressIntro {...sipProps} />
        </div>
      </va-alert>
    </>
  ) : (
    <SaveInProgressIntro {...sipProps} />
  );
};

SaveInProgressInfo.propTypes = {
  formConfig: PropTypes.object,
  pageList: PropTypes.object,
};

export default SaveInProgressInfo;
