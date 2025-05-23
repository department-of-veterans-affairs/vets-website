import React from 'react';
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
import CompleteReferral from './CompleteReferral';
import ReferralLayout from './components/ReferralLayout';
import { useGetReferralByIdQuery } from '../redux/api/vaosApi';

export default function ReferralAppointments() {
  useManualScrollRestoration();
  const basePath = useRouteMatch();
  const { isInCCPilot } = useIsInCCPilot();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const { data: referral, error, isLoading } = useGetReferralByIdQuery(id, {
    skip: !id,
  });

  if (referral?.attributes?.hasAppointments) {
    return <Redirect to="/referrals-requests" />;
  }

  if (!isInCCPilot) {
    return <Redirect from={basePath.url} to="/" />;
  }

  if (isLoading) {
    return <ReferralLayout loadingMessage="Loading your data..." />;
  }

  if (error) {
    // Referral Layout shows the error component is apiFailure is true
    return <ReferralLayout apiFailure hasEyebrow heading="Referral Error" />;
  }

  return (
    <>
      <Switch>
        <Route path={`${basePath.url}/complete/:appointmentId`} search={id}>
          <CompleteReferral currentReferral={referral} />
        </Route>
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
