import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScheduleReferral from './ScheduleReferral';
import ReviewAndConfirm from './ReviewAndConfirm';
import ChooseDateAndTime from './ChooseDateAndTime';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { useIsInCCPilot } from './hooks/useIsInCCPilot';
import { FETCH_STATUS } from '../utils/constants';
import FormLayout from '../new-appointment/components/FormLayout';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import CompleteReferral from './CompleteReferral';
import ReferralLayout from './components/ReferralLayout';
import {
  getAppointmentCreateStatus,
  getReferralAppointmentInfo,
} from './redux/selectors';
import { useGetReferralByIdQuery } from '../redux/api/vaosApi';

export default function ReferralAppointments() {
  useManualScrollRestoration();
  const basePath = useRouteMatch();
  const { isInCCPilot } = useIsInCCPilot();
  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const [, appointmentId] = pathname.split('/schedule-referral/complete/');
  const { appointmentInfoLoading } = useSelector(getReferralAppointmentInfo);
  const appointmentCreateStatus = useSelector(getAppointmentCreateStatus);
  const { data: referral, error, isLoading } = useGetReferralByIdQuery(id, {
    skip: !id,
  });

  useEffect(
    () => {
      if (referral) {
        scrollAndFocus('h1');
      } else if (error) {
        scrollAndFocus('h2');
      }
    },
    [error, referral],
  );

  if (!isInCCPilot) {
    return <Redirect from={basePath.url} to="/" />;
  }

  if (!referral && error) {
    // Referral Layout shows the error component is apiFailure is true
    return <ReferralLayout apiFailure hasEyebrow heading="Referral Error" />;
  }

  if (
    appointmentId &&
    appointmentInfoLoading &&
    appointmentCreateStatus === FETCH_STATUS.succeeded
  ) {
    return (
      <ReferralLayout loadingMessage="Confirming your appointment. This may take up to 30 seconds. Please don’t refresh the page." />
    );
  }

  if ((!referral || isLoading) && !appointmentId) {
    // @TODO: Switch to using ReferralLayout
    return (
      <FormLayout pageTitle="Review Approved Referral">
        <va-loading-indicator set-focus message="Loading your data..." />
      </FormLayout>
    );
  }

  if (appointmentId) {
    return (
      <Switch>
        <Route
          path={`${basePath.url}/complete/:appointmentId`}
          component={CompleteReferral}
        />
      </Switch>
    );
  }

  return (
    <>
      <Switch>
        <Route path={`${basePath.url}/review/`} search={id}>
          <ReviewAndConfirm currentReferral={referral} />
        </Route>
        <Route path={`${basePath.url}/date-time/`} search={id}>
          <ChooseDateAndTime currentReferral={referral} />
        </Route>
        <Route path={`${basePath.url}`} search={id}>
          <ScheduleReferral currentReferral={referral} />
        </Route>
      </Switch>
    </>
  );
}
