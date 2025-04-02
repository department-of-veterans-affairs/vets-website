import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  useLocation,
} from 'react-router-dom';
import ScheduleReferral from './ScheduleReferral';
import ReviewAndConfirm from './ReviewAndConfirm';
import ChooseDateAndTime from './ChooseDateAndTime';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { useIsInCCPilot } from './hooks/useIsInCCPilot';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import CompleteReferral from './CompleteReferral';
import ReferralLayout from './components/ReferralLayout';
import { useGetReferralByIdQuery } from '../redux/api/vaosApi';

export default function ReferralAppointments() {
  useManualScrollRestoration();
  const basePath = useRouteMatch();
  const { isInCCPilot } = useIsInCCPilot();
  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const [, appointmentId] = pathname.split('/schedule-referral/complete/');
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

  if ((!referral || isLoading) && !appointmentId) {
    return (
      <ReferralLayout
        loadingMessage="Loading your data..."
        heading="Review Approved Referral"
      />
    );
  }

  return (
    <>
      <Switch>
        <Route
          path={`${basePath.url}/complete/:appointmentId`}
          component={CompleteReferral}
        />
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
