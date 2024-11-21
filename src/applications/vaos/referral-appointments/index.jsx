import React, { useEffect, useState } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ScheduleReferral from './ScheduleReferral';
import ConfirmApprovedPage from './ConfirmApprovedPage';
import ChooseDateAndTime from './ChooseDateAndTime';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { selectFeatureCCDirectScheduling } from '../redux/selectors';
import { useGetReferralById } from './hooks/useGetReferralById';
import { FETCH_STATUS } from '../utils/constants';
import FormLayout from '../new-appointment/components/FormLayout';
import { scrollAndFocus } from '../utils/scrollAndFocus';

export default function ReferralAppointments() {
  useManualScrollRestoration();
  const basePath = useRouteMatch();
  const featureCCDirectScheduling = useSelector(
    selectFeatureCCDirectScheduling,
  );
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
    return (
      <VaAlert status="error" visible>
        <h2 slot="headline">
          There was an error trying to get your referral data
        </h2>
        <p>Please try again later, or contact your VA facility for help.</p>
      </VaAlert>
    );
  }
  if (referralNotFound || !featureCCDirectScheduling) {
    return <Redirect from={basePath.url} to="/" />;
  }
  return (
    <>
      <Switch>
        <Route
          path={`${basePath.url}/review/`}
          component={ConfirmApprovedPage}
        />
        <Route
          path={`${basePath.url}/date-time/`}
          component={ChooseDateAndTime}
        />
        <Route path={`${basePath.url}`} search={id}>
          <ScheduleReferral currentReferral={referral} />
        </Route>
      </Switch>
    </>
  );
}
