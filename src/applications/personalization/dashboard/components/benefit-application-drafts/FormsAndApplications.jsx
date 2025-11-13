import React, { useLayoutEffect, useRef } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import ApplicationsByStatus from './ApplicationsByStatus';
import Error from './Error';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';

const FormsAndApplications = ({ submittedError }) => {
  const sectionRef = useRef(null);

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
      <h2>Forms and applications</h2>
      {submittedError && (
        <DashboardWidgetWrapper>
          <Error />
        </DashboardWidgetWrapper>
      )}
      {!submittedError && (
        <>
          <ApplicationsByStatus
            applicationStatus="in-progress"
            hideMissingApplicationHelp
          />
          <ApplicationsByStatus applicationStatus="completed" />
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  // normalize full vs. partial errors into a single true/false value and provide as prop
  const submittedError =
    !!state.submittedForms.error || state.submittedForms.errors?.length > 0;

  return {
    submittedError,
  };
};

FormsAndApplications.propTypes = {
  getESREnrollmentStatus: PropTypes.func,
  getFormStatuses: PropTypes.func,
  submittedError: PropTypes.bool,
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormsAndApplications);
