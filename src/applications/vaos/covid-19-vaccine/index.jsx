import React, { useEffect } from 'react';
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
      !isNewAppointmentStarted && !location.pathname.endsWith('confirmation'),
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
      <FormLayout>
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
    <FormLayout>
      <Switch>
        <Route
          path={`${match.url}/confirm-doses-received`}
          component={ReceivedDoseScreenerPage}
        />
        <Route
          path={`${match.url}/contact-facility`}
          component={ContactFacilitiesPage}
        />
        <Route
          path={`${match.url}/choose-facility`}
          component={VAFacilityPage}
        />
        <Route
          path={`${match.url}/choose-clinic`}
          component={ClinicChoicePage}
        />
        <Route path={`${match.url}/select-date`} component={SelectDate1Page} />
        <Route
          path={`${match.url}/second-dose-info`}
          component={SecondDosePage}
        />
        <Route path={`${match.url}/contact-info`} component={ContactInfoPage} />
        <Route path={`${match.url}/review`} component={ReviewPage} />
        <Route
          path={`${match.url}/confirmation`}
          component={ConfirmationPageV2}
        />
        <Route path="/" component={PlanAheadPage} />
      </Switch>
    </FormLayout>
  );
}

export const reducer = covid19VaccineReducer;
