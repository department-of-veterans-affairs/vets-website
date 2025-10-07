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
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const { data: referral, error, isLoading } = useGetReferralByIdQuery(id, {
    skip: !id,
  });

  if (referral?.attributes?.appointments?.data.length > 0) {
    const appointmentId = referral.attributes.appointments.data[0].id;
    const path =
      referral.attributes.appointments.system === 'VAOS'
        ? `${basePath.url}/${appointmentId}`
        : `${basePath.url}/${appointmentId}?eps=true&hasAppointments=true`;
    return <Redirect to={path} />;
  }

  if (!isInPilotUserStations) {
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
