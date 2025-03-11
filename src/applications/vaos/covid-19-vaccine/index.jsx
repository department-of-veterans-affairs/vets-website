import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
} from 'react-router-dom';
import covid19VaccineReducer from './redux/reducer';
import { selectIsNewAppointmentStarted } from '../new-appointment/redux/selectors';
import { selectFeatureBreadcrumbUrlUpdate } from '../redux/selectors';
import FormLayout from './components/FormLayout';
import PlanAheadPage from './components/PlanAheadPage';
import VAFacilityPage from './components/VAFacilityPage';
import ClinicChoicePage from './components/ClinicChoicePage';
import SelectDate1Page from './components/SelectDate1Page';
import ReviewPage from './components/ReviewPage';
import ConfirmationPageV2 from './components/ConfirmationPageV2';
import SecondDosePage from './components/SecondDosePage';
import ContactInfoPage from './components/ContactInfoPage';
import ReceivedDoseScreenerPage from './components/ReceivedDoseScreenerPage';
import ContactFacilitiesPage from './components/ContactFacilitiesPage';
import { FETCH_STATUS } from '../utils/constants';

import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import useFormRedirectToStart from '../hooks/useFormRedirectToStart';
import useFormUnsavedDataWarning from '../hooks/useFormUnsavedDataWarning';
import ErrorMessage from '../components/ErrorMessage';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import {
  selectCanUseVaccineFlow,
  selectFacilitySettingsStatus,
} from '../appointment-list/redux/selectors';
import { fetchFacilitySettings } from '../appointment-list/redux/actions';

export function NewBookingSection() {
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useDispatch();
  const canUseVaccineFlow = useSelector(selectCanUseVaccineFlow);
  const facilitySettingsStatus = useSelector(selectFacilitySettingsStatus);
  const isNewAppointmentStarted = useSelector(selectIsNewAppointmentStarted);
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const [crumb, setCrumb] = useState('New COVID-19 vaccine appointment');

  useEffect(
    () => {
      if (facilitySettingsStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchFacilitySettings());
      }
    },
    [dispatch, facilitySettingsStatus],
  );

  useEffect(
    () => {
      if (facilitySettingsStatus === FETCH_STATUS.failed) {
        scrollAndFocus();
      }
    },
    [facilitySettingsStatus],
  );

  useManualScrollRestoration();

  useFormUnsavedDataWarning({
    // We don't want to warn a user about leaving the flow when they're shown the page
    // that says they can't make an appointment online
    disabled: location.pathname.includes('contact-facility'),
  });

  const shouldRedirectToStart = useFormRedirectToStart({
    shouldRedirect: () =>
      !isNewAppointmentStarted &&
      !location.pathname.endsWith('confirmation') &&
      !location.pathname.endsWith('covid-vaccine/'),
  });

  if (shouldRedirectToStart) {
    return <Redirect to="/" />;
  }

  if (facilitySettingsStatus === FETCH_STATUS.failed) {
    return <ErrorMessage level="1" />;
  }

  if (
    facilitySettingsStatus === FETCH_STATUS.loading ||
    facilitySettingsStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <FormLayout pageTitle={crumb}>
        <va-loading-indicator
          set-focus
          message="Checking for online appointment availability"
        />
      </FormLayout>
    );
  }

  // Redirect the user to the Contact Facility page when there are no facilities that
  // support scheduling an appointment for the vaccine.
  if (
    !canUseVaccineFlow &&
    facilitySettingsStatus === FETCH_STATUS.succeeded &&
    !location.pathname.includes(`${match.url}/contact-facility`)
  ) {
    return <Redirect to={`${match.url}/contact-facility`} />;
  }

  return (
    <FormLayout pageTitle={crumb}>
      <Switch>
        <Route
          path={
            featureBreadcrumbUrlUpdate
              ? `${match.url}/doses-received`
              : `${match.url}/confirm-doses-received`
          }
        >
          <ReceivedDoseScreenerPage
            changeCrumb={newTitle => setCrumb(newTitle)}
          />
        </Route>
        <Route path={`${match.url}/contact-facility`}>
          <ContactFacilitiesPage changeCrumb={newTitle => setCrumb(newTitle)} />
        </Route>
        <Route
          path={
            featureBreadcrumbUrlUpdate
              ? `${match.url}/location`
              : `${match.url}/choose-facility`
          }
        >
          <VAFacilityPage changeCrumb={newTitle => setCrumb(newTitle)} />
        </Route>
        <Route
          path={
            featureBreadcrumbUrlUpdate
              ? `${match.url}/clinic`
              : `${match.url}/choose-clinic`
          }
        >
          <ClinicChoicePage changeCrumb={newTitle => setCrumb(newTitle)} />
        </Route>
        <Route
          path={
            featureBreadcrumbUrlUpdate
              ? `${match.url}/date-time`
              : `${match.url}/select-date`
          }
        >
          <SelectDate1Page changeCrumb={newTitle => setCrumb(newTitle)} />
        </Route>
        <Route
          path={
            featureBreadcrumbUrlUpdate
              ? `${match.url}/second-dose`
              : `${match.url}/second-dose-info`
          }
        >
          <SecondDosePage changeCrumb={newTitle => setCrumb(newTitle)} />
        </Route>
        <Route
          path={
            featureBreadcrumbUrlUpdate
              ? `${match.url}/contact-information`
              : `${match.url}/contact-info`
          }
        >
          <ContactInfoPage changeCrumb={newTitle => setCrumb(newTitle)} />
        </Route>
        <Route path={`${match.url}/review`}>
          <ReviewPage changeCrumb={newTitle => setCrumb(newTitle)} />
        </Route>
        <Route
          exact
          path={
            featureBreadcrumbUrlUpdate
              ? `${match.path}/:id`
              : `${match.url}/confirmation`
          }
        >
          <ConfirmationPageV2 changeCrumb={newTitle => setCrumb(newTitle)} />
        </Route>
        <Route path={`${match.url}`}>
          <PlanAheadPage changeCrumb={newTitle => setCrumb(newTitle)} />
        </Route>
      </Switch>
    </FormLayout>
  );
}

export const reducer = covid19VaccineReducer;
