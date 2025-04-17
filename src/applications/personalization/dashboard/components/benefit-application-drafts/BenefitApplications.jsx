import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { VA_FORM_IDS } from '~/platform/forms/constants';
import { isVAPatient, isLOA3, selectProfile } from '~/platform/user/selectors';
import { filterOutExpiredForms } from '~/applications/personalization/dashboard/helpers';

import { getEnrollmentStatus as getEnrollmentStatusAction } from '~/platform/user/profile/actions/hca';

import { fetchFormStatuses } from '../../actions/form-status';
import ApplicationsInProgress from './ApplicationsInProgress';

const BenefitApplications = ({
  getESREnrollmentStatus,
  getFormStatuses,
  shouldGetESRStatus,
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (shouldGetESRStatus) {
      getESREnrollmentStatus();
    }
  }, [shouldGetESRStatus, getESREnrollmentStatus]);

  useEffect(() => {
    getFormStatuses();
  }, [getFormStatuses]);

  useLayoutEffect(() => {
    const handleAnchorLink = () => {
      if (document.location.hash === '#benefit-applications') {
        const elt = sectionRef.current;
        const sectionPosition =
          elt?.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionPosition,
          behavior: 'smooth',
        });
        elt?.focus();
      }
    };

    handleAnchorLink();
  }, []);

  return (
    <div
      data-testid="dashboard-section-benefit-application-drafts"
      id="benefit-applications"
      ref={sectionRef}
      tabIndex={-1}
    >
      <h2>Benefit applications and forms</h2>
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

BenefitApplications.propTypes = {
  getESREnrollmentStatus: PropTypes.func,
  getFormStatuses: PropTypes.func,
  shouldGetESRStatus: PropTypes.bool,
};

const mapDispatchToProps = {
  getFormStatuses: fetchFormStatuses,
  getESREnrollmentStatus: getEnrollmentStatusAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BenefitApplications);
