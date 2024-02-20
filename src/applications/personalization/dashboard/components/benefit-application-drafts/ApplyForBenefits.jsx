import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchEDUPaymentInformation as fetchEDUPaymentInformationAction } from '@@profile/actions/paymentInformation';
import { VA_FORM_IDS } from '~/platform/forms/constants';
import recordEvent from '~/platform/monitoring/record-event';
import { isVAPatient, isLOA3, selectProfile } from '~/platform/user/selectors';

import { filterOutExpiredForms } from '~/applications/personalization/dashboard/helpers';

import { getEnrollmentStatus as getEnrollmentStatusAction } from '~/platform/user/profile/actions/hca';

import ApplicationsInProgress from './ApplicationsInProgress';
import BenefitOfInterest from './BenefitOfInterest';

const BenefitsOfInterest = ({ children }) => {
  return (
    <>
      <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5">
        Explore VA benefits and health care
      </h3>
      <div data-testid="benefits-of-interest">
        <div className="vads-l-row">{children}</div>
      </div>
    </>
  );
};

BenefitsOfInterest.propTypes = {
  children: PropTypes.object,
};

const ApplyForBenefits = ({ getESREnrollmentStatus, shouldGetESRStatus }) => {
  useEffect(
    () => {
      if (shouldGetESRStatus) {
        getESREnrollmentStatus();
      }
    },
    [shouldGetESRStatus, getESREnrollmentStatus],
  );

  return (
    <div data-testid="dashboard-section-apply-for-benefits">
      <h2>Apply for VA benefits</h2>
      <ApplicationsInProgress />
      <BenefitsOfInterest>
        <>
          <BenefitOfInterest
            title="Health care"
            icon="health-care"
            ctaButtonLabel="Learn how to apply for VA health care"
            ctaUrl="/health-care/how-to-apply/"
            onClick={() => {
              recordEvent({
                event: 'dashboard-navigation',
                'dashboard-action': 'view-link',
                'dashboard-product': 'recommendations-health-care-apply-now',
              });
            }}
          >
            <p>
              With VA health care, you’ll receive coverage for services like
              regular checkups with your health care provider and specialist
              appointments.
            </p>
          </BenefitOfInterest>
          <BenefitOfInterest
            title="Disability compensation"
            icon="disability"
            ctaButtonLabel="Learn how to file a VA disability claim"
            ctaUrl="/disability/how-to-file-claim/"
            onClick={() => {
              recordEvent({
                event: 'dashboard-navigation',
                'dashboard-action': 'view-link',
                'dashboard-product': 'recommendations-disability-file-claim',
              });
            }}
          >
            <p>
              With VA disability benefits, you can get disability compensation
              for an illness or injury that was caused, or made worse, by your
              military service.
            </p>
          </BenefitOfInterest>
          <BenefitOfInterest
            title="Education and training"
            icon="education"
            ctaButtonLabel="Learn how to apply for VA education benefits"
            ctaUrl="/education/how-to-apply/"
            onClick={() => {
              recordEvent({
                event: 'dashboard-navigation',
                'dashboard-action': 'view-link',
                'dashboard-product': 'recommendations-education-apply-now',
              });
            }}
          >
            <p data-testid="benefit-of-interest-education-text">
              With VA education benefits, you and your qualified family members
              can get help finding a college or training program and paying for
              tuition or test fees.
            </p>
          </BenefitOfInterest>
        </>
      </BenefitsOfInterest>
    </div>
  );
};

ApplyForBenefits.propTypes = {
  getESREnrollmentStatus: PropTypes.func.isRequired,
  shouldGetESRStatus: PropTypes.bool.isRequired,
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

const mapDispatchToProps = {
  getDD4EDUStatus: fetchEDUPaymentInformationAction,
  getESREnrollmentStatus: getEnrollmentStatusAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplyForBenefits);
