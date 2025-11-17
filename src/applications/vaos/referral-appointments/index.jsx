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
import { useIsInPilotUserStations } from './hooks/useIsInPilotUserStations';
import CompleteReferral from './CompleteReferral';
import ReferralLayout from './components/ReferralLayout';
import { useGetReferralByIdQuery } from '../redux/api/vaosApi';

export default function ReferralAppointments() {
  useManualScrollRestoration();
  const basePath = useRouteMatch();
  const { isInPilotUserStations } = useIsInPilotUserStations();
  const location = useLocation();
  const { search } = location;
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const { data: referral, error, isLoading } = useGetReferralByIdQuery(id, {
    skip: !id,
  });

  // Don't redirect if on the initial schedule referral page (first page of flow)
  // Check if pathname matches the base path exactly (no sub-routes like /review or /date-time)
  const isOnInitialScheduleReferralPage = location.pathname === basePath.url;
  if (
    referral?.attributes?.hasAppointments &&
    !isOnInitialScheduleReferralPage
  ) {
    return <Redirect to="/referrals-requests" />;
  }

  if (!isInPilotUserStations) {
    return <Redirect from={basePath.url} to="/" />;
  }

  if (isLoading) {
    return <ReferralLayout loadingMessage="Loading your data..." />;
  }

  if (error) {
    // Referral Layout shows the error component is apiFailure is true
    return (
      <ReferralLayout
        apiFailure
        hasEyebrow
        heading="Something went wrong on our end"
        errorBody="Something went wrong on our end. Please try again later. If you need help, call your facility's community care office."
      />
    );
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
