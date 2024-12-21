import React, { useEffect, useState } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  useLocation,
} from 'react-router-dom';
import ScheduleReferral from './ScheduleReferral';
import ReviewAndConfirm from './ReviewAndConfirm';
import ConfirmReferral from './ConfirmReferral';
import ChooseDateAndTime from './ChooseDateAndTime';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { useGetReferralById } from './hooks/useGetReferralById';
import { useIsInCCPilot } from './hooks/useIsInCCPilot';
import { FETCH_STATUS } from '../utils/constants';
import FormLayout from '../new-appointment/components/FormLayout';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import ErrorAlert from './components/ErrorAlert';

export default function ReferralAppointments() {
  useManualScrollRestoration();
  const basePath = useRouteMatch();
  const { isInCCPilot } = useIsInCCPilot();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const id = params.get('id');
  const {
    currentReferral,
    referralNotFound,
    referralFetchStatus,
  } = useGetReferralById(id);
  const [referral, setReferral] = useState(currentReferral);
  useEffect(
    () => {
      setReferral(currentReferral);
    },
    [currentReferral],
  );
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
  if (referralNotFound || !isInCCPilot) {
    return <Redirect from={basePath.url} to="/" />;
  }
  if (
    (!referral || referralFetchStatus === FETCH_STATUS.loading) &&
    !referralNotFound
  ) {
    return (
      <FormLayout pageTitle="Review Approved Referral">
        <va-loading-indicator set-focus message="Loading your data..." />
      </FormLayout>
    );
  }

  if (referralFetchStatus === FETCH_STATUS.failed) {
    return <ErrorAlert />;
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
        {/* TODO: remove this mock page when referral complete page is built */}
        <Route path={`${basePath.url}/confirm`}>
          <ConfirmReferral currentReferral={referral} />
        </Route>
        <Route path={`${basePath.url}`} search={id}>
          <ScheduleReferral currentReferral={referral} />
        </Route>
      </Switch>
    </>
  );
}
