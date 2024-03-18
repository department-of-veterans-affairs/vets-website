import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { selectEnrollmentStatus } from '../../utils/selectors/entrollment-status';
import { selectAuthStatus } from '../../utils/selectors/auth-status';
import EnrollmentStatusAlert from '../FormAlerts/EnrollmentStatusAlert';
import VerifiedPrefillAlert from '../FormAlerts/VerifiedPrefillAlert';
import PreferredFacilityAlert from '../FormAlerts/PreferredFacilityAlert';
import FinancialMeansTestWarning from '../FormAlerts/FinancialStatusWarning';
import content from '../../locales/en/content.json';

const SaveInProgressInfo = ({ formConfig, pageList }) => {
  const { isLoggedOut } = useSelector(selectAuthStatus);
  const {
    canSubmitFinancialInfo,
    hasPreferredFacility,
    isValidEnrollmentStatus,
    hasServerError,
  } = useSelector(selectEnrollmentStatus);
  const {
    downtime,
    prefillEnabled,
    savedFormMessages,
    customText,
  } = formConfig;

  // set the props to use for the SaveInProgressIntro components
  const sipProps = {
    startText: content['sip-start-form-text'],
    unauthStartText: content['sip-sign-in-to-start-text'],
    messages: savedFormMessages,
    formConfig: { customText },
    headingLevel: 3,
    verifiedPrefillAlert: VerifiedPrefillAlert,
    buttonOnly: isLoggedOut,
    hideUnauthedStartLink: false,
    prefillEnabled,
    downtime,
    pageList,
  };

  const sipIntro = <SaveInProgressIntro {...sipProps} />;

  // set the correct alert to render based on enrollment status
  const LoggedInAlertToRender = () => {
    if (!isValidEnrollmentStatus)
      return <EnrollmentStatusAlert showError={hasServerError} />;
    if (!hasPreferredFacility) return <PreferredFacilityAlert />;
    if (!canSubmitFinancialInfo)
      return (
        <>
          <FinancialMeansTestWarning />
          {sipIntro}
        </>
      );
    return sipIntro;
  };

  return isLoggedOut ? (
    <>
      <va-alert
        status="info"
        class="vads-u-margin-y--4"
        data-testid="ezr-login-alert"
        uswds
      >
        <h3 slot="headline">{content['sip-alert-title']}</h3>
        <div>
          <ul>
            <li>
              We can fill in some of your information for you to save you time.
            </li>
            <li>
              You can save your work in progress. You’ll have 60 days from when
              you start or make updates to your application to come back and
              finish it.
            </li>
          </ul>
          {sipIntro}
        </div>
      </va-alert>
    </>
  ) : (
    <div className="vads-u-margin-y--4">{LoggedInAlertToRender()}</div>
  );
};

SaveInProgressInfo.propTypes = {
  formConfig: PropTypes.object,
  pageList: PropTypes.array,
};

export default SaveInProgressInfo;
