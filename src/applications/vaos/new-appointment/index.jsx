import React from 'react';
import { useSelector } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
} from 'react-router-dom';
import { selectIsCernerOnlyPatient } from 'platform/user/cerner-dsot/selectors';
import { selectIsNewAppointmentStarted } from './redux/selectors';
import newAppointmentReducer from './redux/reducer';
import FormLayout from './components/FormLayout';
import TypeOfCarePage from './components/TypeOfCarePage';
import ContactInfoPage from './components/ContactInfoPage';
import TypeOfVisitPage from './components/TypeOfVisitPage';
import TypeOfSleepCarePage from './components/TypeOfSleepCarePage';
import TypeOfEyeCarePage from './components/TypeOfEyeCarePage';
import TypeOfAudiologyCarePage from './components/TypeOfAudiologyCarePage';
import PreferredDatePageVaDate from './components/PreferredDatePageVaDate';
import VARequest from './components/DateTimeRequestPage/VA';
import CCRequest from './components/DateTimeRequestPage/CommunityCare';
import DateTimeSelectPage from './components/DateTimeSelectPage';
import VAFacilityPageV2 from './components/VAFacilityPage/VAFacilityPageV2';
import ClosestCityStatePage from './components/ClosestCityStatePage';
import CommunityCareLanguagePage from './components/CommunityCareLanguagePage';
import CommunityCareProviderSelectionPage from './components/CommunityCareProviderSelectionPage';
import ClinicChoicePage from './components/ClinicChoicePage';
import ProviderSelectPage from './components/ProviderSelectPage';
import ReasonForAppointmentPage from './components/ReasonForAppointmentPage';
import ReviewPage from './components/ReviewPage';
import TypeOfFacilityPage from './components/TypeOfFacilityPage';
import useFormRedirectToStart from '../hooks/useFormRedirectToStart';
import useFormUnsavedDataWarning from '../hooks/useFormUnsavedDataWarning';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import ScheduleCernerPage from './components/ScheduleCernerPage';

export function NewAppointment() {
  const isCernerOnlyPatient = useSelector(selectIsCernerOnlyPatient);
  const isNewAppointmentStarted = useSelector(selectIsNewAppointmentStarted);
  const match = useRouteMatch();
  const location = useLocation();
  const pageTitle = 'Schedule an appointment';

  useManualScrollRestoration();

  useFormUnsavedDataWarning({
    // If we're on the facility page for a Cerner only patient, there's a link to send the user to
    // the Cerner portal, and it would be annoying to show the "You may have unsaved changes" message
    // when a user clicks on that link
    disabled: location.pathname.includes('va-facility') && isCernerOnlyPatient,
  });

  const shouldRedirectToStart = useFormRedirectToStart({
    shouldRedirect: () =>
      !isNewAppointmentStarted &&
      !location.pathname.endsWith('confirmation') &&
      !location.pathname.endsWith('type-of-care'),
  });

  if (shouldRedirectToStart) {
    return <Redirect to="/" />;
  }

  return (
    <FormLayout pageTitle={pageTitle}>
      <Switch>
        <Route
          path={[
            `${match.url}/va-request/contact-information`,
            `${match.url}/community-request/contact-information`,
            `${match.url}/contact-information`,
          ]}
        >
          <ContactInfoPage />
        </Route>
        <Route path={`${match.url}/facility-type`}>
          <TypeOfFacilityPage />
        </Route>
        <Route
          path={[
            `${match.url}/va-request/preferred-method`,
            `${match.url}/choose-visit-type`,
          ]}
        >
          <TypeOfVisitPage />
        </Route>
        <Route path={`${match.url}/sleep-care`}>
          <TypeOfSleepCarePage />
        </Route>
        <Route path={`${match.url}/eye-care`}>
          <TypeOfEyeCarePage />
        </Route>
        <Route path={`${match.url}/audiology-care`}>
          <TypeOfAudiologyCarePage />
        </Route>
        <Route path={`${match.url}/preferred-date`}>
          <PreferredDatePageVaDate />
        </Route>
        <Route path={`${match.url}/date-time`}>
          <DateTimeSelectPage />
        </Route>
        <Route exact path={`${match.url}/va-request/`}>
          <VARequest />
        </Route>
        <Route exact path={`${match.url}/community-request/`}>
          <CCRequest />
        </Route>
        <Route path={`${match.url}/location`}>
          <VAFacilityPageV2 />
        </Route>
        <Route path={`${match.url}/provider`}>
          <ProviderSelectPage />
        </Route>
        <Route path={`${match.url}/how-to-schedule`}>
          <ScheduleCernerPage />
        </Route>
        <Route
          path={[
            `${match.url}/va-request/community-care-preferences`,
            `${match.url}/community-request/preferred-provider`,
          ]}
        >
          <CommunityCareProviderSelectionPage />
        </Route>
        <Route
          path={[
            `${match.url}/va-request/community-care-language`,
            `${match.url}/community-request/preferred-language`,
          ]}
        >
          <CommunityCareLanguagePage />
        </Route>
        <Route
          path={[
            `${match.url}/va-request/choose-closest-city`,
            `${match.url}/community-request/closest-city`,
          ]}
        >
          <ClosestCityStatePage />
        </Route>
        <Route path={`${match.url}/clinic`}>
          <ClinicChoicePage />
        </Route>
        <Route
          path={[
            `${match.url}/va-request/reason`,
            `${match.url}/community-request/reason`,
            `${match.url}/reason`,
          ]}
        >
          <ReasonForAppointmentPage />
        </Route>
        <Route
          path={[
            `${match.url}/va-request/review`,
            `${match.url}/community-request/review`,
            `${match.url}/review`,
          ]}
        >
          <ReviewPage />
        </Route>
        <Route path={match.url}>
          <TypeOfCarePage />
        </Route>
      </Switch>
    </FormLayout>
  );
}

export const reducer = newAppointmentReducer;
