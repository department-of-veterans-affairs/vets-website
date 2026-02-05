/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { fetchCh31CaseStatusDetails } from '../actions/ch31-my-eligibility-and-benefits';
import HubCardList from '../components/HubCardList';
import NeedHelp from '../components/NeedHelp';
import AppointmentScheduledAlert from '../components/AppointmentScheduledAlert';
import ApplicationDiscontinuedAlert from '../components/ApplicationDiscontinuedAlert';
import LoadCaseDetailsFailedAlert from '../components/LoadCaseDetailsFailedAlert';
import ApplicationInterruptedAlert from '../components/ApplicationInterruptedAlert';
import CaseProgressBar from '../components/CaseProgressBar';
import { getCurrentStepFromStateList } from '../helpers';
// import CaseProgressAccordion from '../components/CaseProgressAccordion';
// import CaseProgressProcessList from '../components/CaseProgressProcessList';

const stepLabels = [
  'Application Received',
  'Eligibility Determination',
  'Orientation Video',
  'Initial Evaluation Counselor Meeting',
  'Entitlement Determination date',
  'Rehabilitation Plan/Career Track',
  'Benefits Initiated',
];

const MyCaseManagementHub = () => {
  const dispatch = useDispatch();

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showMyCaseManagementHubPage = useToggleValue(
    TOGGLE_NAMES.vre_eligibility_status_phase_2_updates,
  );

  const total = stepLabels.length; // 7
  const [current, setCurrent] = useState(1);

  const caseStatusState = useSelector(state => state?.ch31CaseStatusDetails);

  const loading = caseStatusState?.loading;
  const caseStatusDetails = caseStatusState?.data;
  const caseStatusError = caseStatusState?.error;

  const attrs = caseStatusDetails?.attributes || {};
  const externalStatus = attrs.externalStatus || {};

  const {
    isDiscontinued = false,
    discontinuedReason,
    isInterrupted = false,
    interruptedReason,
    stateList = [],
  } = externalStatus;

  const showAppointmentAlert = stateList.some(
    s => s?.stepCode === 'INTAKE' && s?.status === 'ACTIVE',
  );
  const appointment = attrs?.orientationAppointmentDetails;

  useEffect(
    () => {
      if (!loading) {
        scrollToTop();
        focusElement('h1');
      }
    },
    [loading],
  );

  useEffect(
    () => {
      dispatch(fetchCh31CaseStatusDetails());
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (!stateList.length) return;

      setCurrent(getCurrentStepFromStateList(stateList, total));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stateList, total],
  );

  if (!showMyCaseManagementHubPage) {
    return (
      <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
        <h1>My Case Management Hub</h1>
        <p className="vads-u-color--gray-medium">
          This page isn’t available right now.
        </p>
      </div>
    );
  }
  if (loading) {
    return (
      <div>
        <div className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
          <h1>My Case Management Hub</h1>
          <va-loading-indicator
            set-focus
            message="Loading your case management hub..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
      <h1>My VR&E Chapter 31 Benefits Tracker</h1>

      <p>
        The VR&E Benefits Tracker enables Veterans to manage their entire VR&E
        journey independently, from eligibility determination through program
        participation and completion.
      </p>

      {caseStatusError && <LoadCaseDetailsFailedAlert />}
      {isDiscontinued && (
        <ApplicationDiscontinuedAlert discontinuedReason={discontinuedReason} />
      )}
      {isInterrupted && (
        <ApplicationInterruptedAlert interruptedReason={interruptedReason} />
      )}

      {!caseStatusError &&
        !isDiscontinued &&
        !isInterrupted && (
          <>
            {showAppointmentAlert && (
              <AppointmentScheduledAlert
                appointmentDateTime={appointment?.appointmentDateTime}
                appointmentPlace={appointment?.appointmentPlace}
              />
            )}

            <CaseProgressBar
              current={current}
              setCurrent={setCurrent}
              stepLabels={stepLabels}
              stateList={stateList}
            />
            {/* <CaseProgressAccordion
                stepLabels={stepLabels}
                stateList={stateList}
              /> */}
            {/* <CaseProgressProcessList
              stepLabels={stepLabels}
              stateList={stateList}
            /> */}

            <HubCardList step={current} stateList={stateList} />
          </>
        )}

      <NeedHelp />
      <va-back-to-top />
    </div>
  );
};

export default MyCaseManagementHub;
