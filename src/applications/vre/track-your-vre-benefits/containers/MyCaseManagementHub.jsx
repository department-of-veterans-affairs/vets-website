/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import { fetchCh31CaseStatusDetails } from '../actions/ch31-case-status-details';
import HubCardList from '../components/HubCardList';
import NeedHelp from '../components/NeedHelp';
import AppointmentScheduledAlert from '../components/AppointmentScheduledAlert';
import ApplicationDiscontinuedAlert from '../components/ApplicationDiscontinuedAlert';
import LoadCaseDetailsFailedAlert from '../components/LoadCaseDetailsFailedAlert';
import ApplicationInterruptedAlert from '../components/ApplicationInterruptedAlert';
import CaseProgressBar from '../components/CaseProgressBar';
import { getCurrentStepFromStateList } from '../helpers';

const stepLabels = [
  'Application received',
  'Eligibility determination',
  'Orientation video',
  'Initial evaluation counselor meeting',
  'Entitlement determination date',
  'Rehabilitation plan or career track',
  'Benefits initiated',
];

const pageHeading = 'Your VR&E benefit status';
const pageTitle = 'Your VR&E Benefit Status';
const statusBasePath = '';
// Internal router root. In the browser this resolves to:
// /careers-employment/track-your-vre-benefits/vre-benefit-status
const statusRootRoute = '/';

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

  const total = stepLabels.length;
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
    [stateList, total],
  );

  useEffect(
    () => {
      if (
        !showMyCaseManagementHubPage ||
        loading ||
        caseStatusError ||
        !caseStatusDetails
      ) {
        return;
      }

      if (isDiscontinued || isInterrupted) {
        if (location.pathname !== statusRootRoute) {
          navigate(statusRootRoute, { replace: true });
        }
        return;
      }

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
      isDiscontinued,
      isInterrupted,
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
        The Veteran Readiness and Employment (VR&E) benefits tracker helps you
        manage your Chapter 31 process on your own. It guides you from the
        moment you submit your application all the way through your benefits
        being initiated.
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
