import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { fetchCh31CaseStatusDetails } from '../actions/ch31-my-eligibility-and-benefits';
import HubCardList from '../components/HubCardList';
import NeedHelp from '../components/NeedHelp';
import AppointmentScheduledAlert from '../components/AppointmentScheduledAlert';
import CaseProgressDescription from '../components/CaseProgressDescription';
import ApplicationDiscontinuedAlert from '../components/ApplicationDiscontinuedAlert';
import LoadCaseDetailsFailedAlert from '../components/LoadCaseDetailsFailedAlert';
import ApplicationInterruptedAlert from '../components/ApplicationInterruptedAlert';

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
  const [current, setCurrent] = useState(2);

  const caseStatusState = useSelector(state => state?.ch31CaseStatusDetails);

  const caseStatusDetails = caseStatusState?.data;
  const caseStatusError = caseStatusState?.error;

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
      if (!caseStatusDetails) {
        return;
      }
      const attrs = caseStatusDetails?.attributes;
      const stateList = attrs?.externalStatus?.stateList || [];

      if (!stateList.length) {
        return;
      }

      const activeIndex = stateList.findIndex(step => step.status === 'ACTIVE');

      if (activeIndex >= 0) {
        const activeStep = Math.min(activeIndex + 1, total);
        setCurrent(activeStep);
      }
    },
    [caseStatusDetails, total],
  );

  const goPrev = () => setCurrent(c => Math.max(1, c - 1));
  const goNext = () => setCurrent(c => Math.min(total, c + 1));

  let labelsWithStatus = stepLabels;
  const attrs = caseStatusDetails?.attributes;
  const stateList = attrs?.externalStatus?.stateList || [];

  const showAppointmentAlert = stateList.some(
    step => step?.stepCode === 'INTAKE' && step?.status === 'ACTIVE',
  );

  if (Array.isArray(stateList) && stateList.length) {
    labelsWithStatus = stepLabels.map((label, index) => {
      const stepState = stateList[index];
      if (!stepState || !stepState.status) {
        return label;
      }
      // e.g., "Application Received - COMPLETED"
      return `${label} - [${stepState.status}]`;
    });
  }

  if (!showMyCaseManagementHubPage) {
    return (
      <div className="row">
        <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
          <h1>My Case Management Hub</h1>
          <p className="vads-u-color--gray-medium">
            This page isn’t available right now.
          </p>
        </div>
      </div>
    );
  }

  const isDiscontinued =
    caseStatusDetails?.attributes?.externalStatus?.isDiscontinued;

  const discontinuedReason =
    caseStatusDetails?.attributes?.externalStatus?.discontinuedReason;

  const isInterrupted = caseStatusDetails?.attributes?.isInterrupted;

  return (
    <div className="row">
      <div className="vads-u-margin-top--0p5 vads-u-margin-x--1 vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--0">
        <h1>My VR&E Benefits Tracker</h1>

        <p className="usa-width-two-thirds">
          The VR&E Benefits Tracker enables Veterans to manage their entire VR&E
          journey independently, from eligibility determination through program
          participation and completion.
        </p>

        <h2>Chapter 31 Case Progress</h2>

        {caseStatusError && <LoadCaseDetailsFailedAlert />}
        {isDiscontinued && (
          <ApplicationDiscontinuedAlert
            discontinuedReason={discontinuedReason}
          />
        )}
        {isInterrupted && <ApplicationInterruptedAlert />}

        {!caseStatusError &&
          !isDiscontinued &&
          !isInterrupted && (
            <>
              {showAppointmentAlert && <AppointmentScheduledAlert />}
              <div className="usa-width-one-whole vads-u-margin-top--2">
                <va-segmented-progress-bar
                  counters="small"
                  current={String(current)}
                  heading-text="VA Benefits"
                  label="Label is here"
                  labels={labelsWithStatus.join(';')}
                  total={String(total)}
                />
              </div>

              <CaseProgressDescription step={current} />

              <div className="usa-width-one-whole vads-u-margin-top--3 vads-u-margin-bottom--3">
                <va-button
                  class="vads-u-margin-right--1"
                  secondary
                  onClick={goPrev}
                  disabled={current === 1}
                  text="Previous step"
                />
                <va-button
                  class="vads-u-margin-right--1"
                  onClick={goNext}
                  disabled={current === total}
                  text="Next step"
                />
              </div>

              <HubCardList step={current} />
            </>
          )}

        <div className="usa-width-two-thirds">
          <NeedHelp />
        </div>
      </div>
    </div>
  );
};

export default MyCaseManagementHub;
