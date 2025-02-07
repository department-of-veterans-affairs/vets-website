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
import { useGetReferralById } from './hooks/useGetReferralById';
import { useIsInCCPilot } from './hooks/useIsInCCPilot';
import { FETCH_STATUS } from '../utils/constants';
import FormLayout from '../new-appointment/components/FormLayout';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import CompleteReferral from './CompleteReferral';
import ReferralLayout from './components/ReferralLayout';

export default function ReferralAppointments() {
  useManualScrollRestoration();
  const basePath = useRouteMatch();
  const { isInCCPilot } = useIsInCCPilot();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const { referral, referralFetchStatus } = useGetReferralById(id);
  useEffect(
    () => {
      if (referralFetchStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('h1');
      } else if (referralFetchStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h2');
      }
    },
    [referralFetchStatus],
  );

  if (!isInCCPilot) {
    return <Redirect from={basePath.url} to="/" />;
  }

  if (!referral && referralFetchStatus === FETCH_STATUS.failed) {
    // Referral Layout shows the error component is apiFailure is true
    return <ReferralLayout apiFailure hasEyebrow heading="Referral Error" />;
  }

  if (
    !referral ||
    referralFetchStatus === FETCH_STATUS.loading ||
    referralFetchStatus === FETCH_STATUS.notStarted
  ) {
    // @TODO: Switch to using ReferralLayout
    return (
      <FormLayout pageTitle="Review Approved Referral">
        <va-loading-indicator set-focus message="Loading your data..." />
      </FormLayout>
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
        <Route path={`${basePath.url}/complete/`} search={id}>
          <CompleteReferral currentReferral={referral} />
        </Route>
        <Route path={`${basePath.url}`} search={id}>
          <ScheduleReferral currentReferral={referral} />
        </Route>
      </Switch>
    </>
  );
}
