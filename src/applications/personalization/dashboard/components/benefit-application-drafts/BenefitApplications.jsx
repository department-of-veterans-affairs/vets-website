import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchEDUPaymentInformation as fetchEDUPaymentInformationAction } from '@@profile/actions/paymentInformation';
import PropTypes from 'prop-types';
import { VA_FORM_IDS } from '~/platform/forms/constants';
import { isVAPatient, isLOA3, selectProfile } from '~/platform/user/selectors';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import { filterOutExpiredForms } from '~/applications/personalization/dashboard/helpers';

import { getEnrollmentStatus as getEnrollmentStatusAction } from '~/platform/user/profile/actions/hca';

import { fetchFormStatuses } from '../../actions/form-status';
import ApplicationsInProgress from './ApplicationsInProgress';

const BenefitApplications = ({
  getESREnrollmentStatus,
  getFormStatuses,
  isLOA1,
  shouldGetESRStatus,
}) => {
  useEffect(
    () => {
      if (shouldGetESRStatus) {
        getESREnrollmentStatus();
      }
    },
    [shouldGetESRStatus, getESREnrollmentStatus],
  );

  useEffect(
    () => {
      getFormStatuses();
    },
    [getFormStatuses],
  );

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const isFormSubmissionStatusWork = useToggleValue(
    TOGGLE_NAMES.myVaFormSubmissionStatuses,
  );

  return (
    <div data-testid="dashboard-section-benefit-application-drafts">
      <h2>
        {isFormSubmissionStatusWork
          ? 'Benefit applications and forms'
          : 'Benefit application drafts'}
      </h2>
      <ApplicationsInProgress hideH3 isLOA1={isLOA1} />
    </div>
  );
};

const mapStateToProps = state => {
  const hasHCAInProgress =
    selectProfile(state)
      .savedForms?.filter(filterOutExpiredForms)
      .some(savedForm => savedForm.form === VA_FORM_IDS.FORM_10_10EZ) ?? false;

  const isPatient = isVAPatient(state);

  const shouldGetESRStatus = !hasHCAInProgress && !isPatient && isLOA3(state);

  return {
    shouldGetESRStatus,
  };
};

BenefitApplications.propTypes = {
  getESREnrollmentStatus: PropTypes.func,
  getFormStatuses: PropTypes.func,
  isLOA1: PropTypes.bool,
  shouldGetESRStatus: PropTypes.bool,
};

const mapDispatchToProps = {
  getFormStatuses: fetchFormStatuses,
  getDD4EDUStatus: fetchEDUPaymentInformationAction,
  getESREnrollmentStatus: getEnrollmentStatusAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BenefitApplications);
