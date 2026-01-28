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

  const caseStatusDetails = caseStatusState?.data;
  const caseStatusError = caseStatusState?.error;
  const isDiscontinued =
    caseStatusDetails?.attributes?.externalStatus?.isDiscontinued;

  const discontinuedReason =
    caseStatusDetails?.attributes?.externalStatus?.discontinuedReason;

  const isInterrupted = caseStatusDetails?.attributes?.isInterrupted;

  const attrs = caseStatusDetails?.attributes;
  const stateList = attrs?.externalStatus?.stateList || [];

  const showAppointmentAlert = stateList.some(
    step => step?.stepCode === 'INTAKE' && step?.status === 'ACTIVE',
  );

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  useEffect(
    () => {
      dispatch(fetchCh31CaseStatusDetails());
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (!stateList.length) return;

      const activeIndex = stateList.findIndex(step => step.status === 'ACTIVE');

      if (activeIndex >= 0) {
        setCurrent(Math.min(activeIndex + 1, total));
      } else {
        setCurrent(1);
      }
    },
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

  return (
    <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
      <h1>My VR&E Benefits Tracker</h1>

      <p>
        The VR&E Benefits Tracker enables Veterans to manage their entire VR&E
        journey independently, from eligibility determination through program
        participation and completion.
      </p>

      <h2>Chapter 31 Case Progress</h2>

      {caseStatusError && <LoadCaseDetailsFailedAlert />}
      {isDiscontinued && (
        <ApplicationDiscontinuedAlert discontinuedReason={discontinuedReason} />
      )}
      {isInterrupted && <ApplicationInterruptedAlert />}

      {!caseStatusError &&
        !isDiscontinued &&
        !isInterrupted && (
          <>
            {showAppointmentAlert && <AppointmentScheduledAlert />}

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

            <HubCardList step={current} />
          </>
        )}

      <NeedHelp />
    </div>
  );
};

export default MyCaseManagementHub;
