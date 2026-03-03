/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';
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

const stepLabels = [
  'Application Received',
  'Eligibility Determination',
  'Orientation Video',
  'Initial Evaluation Counselor Meeting',
  'Entitlement Determination date',
  'Rehabilitation Plan or Career Track',
  'Benefits Initiated',
];

const pageHeading = 'Your VR&E benefit status';
const pageTitle = 'Your VR&E Benefit Status';
const statusBasePath = '/track-your-vre-benefits/vre-benefit-status';

const toStepSlug = label =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const stepSlugOverrides = {
  4: 'counselor-appointment',
};

const stepSlugByIndex = [
  null,
  ...stepLabels.map((label, index) => {
    const step = index + 1;
    return stepSlugOverrides[step] ?? toStepSlug(label);
  }),
];

const MyCaseManagementHub = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

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
  const resCaseId = attrs?.resCaseId;
  const externalStatus = attrs.externalStatus || {};

  const {
    isDiscontinued = false,
    discontinuedReason,
    isInterrupted = false,
    interruptedReason,
    stateList = [],
  } = externalStatus;

  const showAppointmentAlert =
    attrs?.orientationAppointmentDetails?.appointmentDateTime &&
    attrs?.orientationAppointmentDetails?.appointmentPlace &&
    stateList.some(s => s?.stepCode === 'INTAKE' && s?.status === 'ACTIVE');

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

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
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

      setCurrent(getCurrentStepFromStateList(stateList, total));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stateList, total],
  );

  useEffect(
    () => {
      if (
        !showMyCaseManagementHubPage ||
        loading ||
        caseStatusError ||
        !caseStatusDetails
      )
        return;

      const stepSlug = stepSlugByIndex[current];
      if (!stepSlug) return;

      const targetPath = `${statusBasePath}/${stepSlug}`;
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    },
    [
      showMyCaseManagementHubPage,
      loading,
      caseStatusError,
      caseStatusDetails,
      current,
      location.pathname,
      navigate,
    ],
  );

  if (!showMyCaseManagementHubPage) {
    return (
      <div className="usa-width-two-thirds vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0">
        <h1>{pageHeading}</h1>
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
          <h1>{pageHeading}</h1>
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
      <h1>{pageHeading}</h1>

      <p>
        The Veteran Readiness and Employment (Chapter 31) Benefits Tracker
        enables Veterans to manage their entire VR&E journey independently, from
        eligibility determination through program participation and completion.
      </p>

      {caseStatusError && <LoadCaseDetailsFailedAlert />}
      {isDiscontinued && (
        <ApplicationDiscontinuedAlert
          discontinuedReason={discontinuedReason}
          resCaseId={resCaseId}
        />
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
              stepLabels={stepLabels}
              stateList={stateList}
              attributes={attrs}
            />

            <HubCardList step={current} stateList={stateList} />
          </>
        )}

      <NeedHelp />
      <va-back-to-top />
    </div>
  );
};

export default MyCaseManagementHub;
