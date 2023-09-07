import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchEDUPaymentInformation as fetchEDUPaymentInformationAction } from '@@profile/actions/paymentInformation';
import PropTypes from 'prop-types';
import { VA_FORM_IDS } from '~/platform/forms/constants';
import { isVAPatient, isLOA3, selectProfile } from '~/platform/user/selectors';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { filterOutExpiredForms } from '~/applications/personalization/dashboard/helpers';

import { getEnrollmentStatus as getEnrollmentStatusAction } from '~/applications/hca/utils/actions';

import ApplicationsInProgress from './ApplicationsInProgress';

const AllBenefits = () => (
  <div className="vads-u-margin-top--2" data-testid="dashboard-all-benefits">
    <va-additional-info trigger="What benefits does VA offer?">
      <p className="vads-u-font-weight--bold">
        Explore VA.gov to learn about the benefits we offer.
      </p>
      <ul>
        <li>
          <a href="/health-care/">Health care</a>
        </li>
        <li>
          <a href="/education/">Education and training</a>
        </li>
        <li>
          <a href="/disability/">Disability compensation</a>
        </li>
        <li>
          <a href="/careers-employment/">Careers &amp; employment</a>
        </li>
        <li>
          <a href="/pension/">Pension</a>
        </li>
        <li>
          <a href="/housing-assistance/">Housing assistance</a>
        </li>
        <li>
          <a href="/burials-memorials/">Burials &amp; memorials</a>
        </li>
        <li>
          <a href="/life-insurance/">Life insurance</a>
        </li>
        <li>
          <a href="/service-member-benefits/">Service member benefits</a>
        </li>
        <li>
          <a href="/family-member-benefits/">Family member benefits</a>
        </li>
      </ul>
    </va-additional-info>
  </div>
);

const SavedApplications = ({ getESREnrollmentStatus, shouldGetESRStatus }) => {
  useEffect(
    () => {
      if (shouldGetESRStatus) {
        getESREnrollmentStatus();
      }
    },
    [shouldGetESRStatus, getESREnrollmentStatus],
  );

  return (
    <div data-testid="dashboard-section-saved-applications">
      <h2>Benefit application drafts</h2>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaUseExperimental}>
        <Toggler.Disabled>
          <AllBenefits />
        </Toggler.Disabled>
      </Toggler>
      <ApplicationsInProgress hideH3 />
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

SavedApplications.propTypes = {
  getESREnrollmentStatus: PropTypes.func,
  shouldGetESRStatus: PropTypes.bool,
};

const mapDispatchToProps = {
  getDD4EDUStatus: fetchEDUPaymentInformationAction,
  getESREnrollmentStatus: getEnrollmentStatusAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SavedApplications);
