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
import UpdatedFormAlertDescription from '../FormDescriptions/UpdatedFormAlertDescription';
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
    hideUnauthedStartLink: true,
    prefillEnabled,
    downtime,
    pageList,
    devOnly: { forceShowFormControls: true },
  };

  const sipIntro = (
    <SaveInProgressIntro {...sipProps}>
      <UpdatedFormAlertDescription />
    </SaveInProgressIntro>
  );

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
    sipIntro
  ) : (
    <div className="vads-u-margin-y--4">{LoggedInAlertToRender()}</div>
  );
};

SaveInProgressInfo.propTypes = {
  formConfig: PropTypes.object,
  pageList: PropTypes.array,
};

export default SaveInProgressInfo;
