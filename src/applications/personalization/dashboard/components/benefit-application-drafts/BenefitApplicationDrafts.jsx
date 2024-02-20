import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchEDUPaymentInformation as fetchEDUPaymentInformationAction } from '@@profile/actions/paymentInformation';
import PropTypes from 'prop-types';
import { VA_FORM_IDS } from '~/platform/forms/constants';
import { isVAPatient, isLOA3, selectProfile } from '~/platform/user/selectors';
import { filterOutExpiredForms } from '~/applications/personalization/dashboard/helpers';

import { getEnrollmentStatus as getEnrollmentStatusAction } from '~/platform/user/profile/actions/hca';

import ApplicationsInProgress from './ApplicationsInProgress';

const BenefitApplicationDrafts = ({
  getESREnrollmentStatus,
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

  return (
    <div data-testid="dashboard-section-benefit-application-drafts">
      <h2>Benefit application drafts</h2>
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

BenefitApplicationDrafts.propTypes = {
  getESREnrollmentStatus: PropTypes.func,
  isLOA1: PropTypes.bool,
  shouldGetESRStatus: PropTypes.bool,
};

const mapDispatchToProps = {
  getDD4EDUStatus: fetchEDUPaymentInformationAction,
  getESREnrollmentStatus: getEnrollmentStatusAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BenefitApplicationDrafts);
