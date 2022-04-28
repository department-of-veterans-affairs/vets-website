import React from 'react';
import { useSelector } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
} from 'react-router-dom';
// import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { selectIsCernerOnlyPatient } from '../redux/selectors';
import { selectIsNewAppointmentStarted } from './redux/selectors';
import newAppointmentReducer from './redux/reducer';
import FormLayout from './components/FormLayout';
import TypeOfCarePage from './components/TypeOfCarePage';
import ContactInfoPage from './components/ContactInfoPage';
import TypeOfVisitPage from './components/TypeOfVisitPage';
import TypeOfSleepCarePage from './components/TypeOfSleepCarePage';
import TypeOfEyeCarePage from './components/TypeOfEyeCarePage';
import TypeOfAudiologyCarePage from './components/TypeOfAudiologyCarePage';
import PreferredDatePage from './components/PreferredDatePage';
import DateTimeRequestPage from './components/DateTimeRequestPage';
import DateTimeSelectPage from './components/DateTimeSelectPage';
import VAFacilityPageV2 from './components/VAFacilityPage/VAFacilityPageV2';
import ClosestCityStatePage from './components/ClosestCityStatePage';
import CommunityCareLanguagePage from './components/CommunityCareLanguagePage';
import CommunityCareProviderSelectionPage from './components/CommunityCareProviderSelectionPage';
import ClinicChoicePage from './components/ClinicChoicePage';
import ReasonForAppointmentPage from './components/ReasonForAppointmentPage';
import ReviewPage from './components/ReviewPage';
import ConfirmationPage from './components/ConfirmationPage';
import TypeOfFacilityPage from './components/TypeOfFacilityPage';
import useFormRedirectToStart from '../hooks/useFormRedirectToStart';
import useFormUnsavedDataWarning from '../hooks/useFormUnsavedDataWarning';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import ScheduleCernerPage from './components/ScheduleCernerPage';
import useVariantSortMethodTracking from './hooks/useVariantSortMethodTracking';

export function NewAppointment() {
  const isCernerOnlyPatient = useSelector(selectIsCernerOnlyPatient);
  const isNewAppointmentStarted = useSelector(selectIsNewAppointmentStarted);

  const match = useRouteMatch();
  const location = useLocation();

  useManualScrollRestoration();

  useFormUnsavedDataWarning({
    // If we're on the facility page for a Cerner only patient, there's a link to send the user to
    // the Cerner portal, and it would be annoying to show the "You may have unsaved changes" message
    // when a user clicks on that link
    disabled: location.pathname.includes('va-facility') && isCernerOnlyPatient,
  });

  const shouldRedirectToStart = useFormRedirectToStart({
    shouldRedirect: () =>
      !isNewAppointmentStarted && !location.pathname.endsWith('confirmation'),
  });

  useVariantSortMethodTracking({ skip: shouldRedirectToStart });

  if (shouldRedirectToStart) {
    return <Redirect to="/" />;
  }

  return (
    <FormLayout isReviewPage={location.pathname.includes('review')}>
      <Switch>
        <Route path={`${match.url}/contact-info`} component={ContactInfoPage} />
        <Route
          path={`${match.url}/choose-facility-type`}
          component={TypeOfFacilityPage}
        />
        <Route
          path={`${match.url}/choose-visit-type`}
          component={TypeOfVisitPage}
        />
        <Route
          path={`${match.url}/choose-sleep-care`}
          component={TypeOfSleepCarePage}
        />
        <Route
          path={`${match.url}/choose-eye-care`}
          component={TypeOfEyeCarePage}
        />
        <Route
          path={`${match.url}/audiology`}
          component={TypeOfAudiologyCarePage}
        />
        <Route
          path={`${match.url}/preferred-date`}
          component={PreferredDatePage}
        />
        <Route
          path={`${match.url}/request-date`}
          component={DateTimeRequestPage}
        />
        <Route
          path={`${match.url}/select-date`}
          component={DateTimeSelectPage}
        />
        <Route
          path={`${match.url}/va-facility-2`}
          component={VAFacilityPageV2}
        />
        <Route
          path={`${match.url}/how-to-schedule`}
          component={ScheduleCernerPage}
        />
        <Route
          path={`${match.url}/community-care-preferences`}
          component={CommunityCareProviderSelectionPage}
        />
        <Route
          path={`${match.url}/community-care-language`}
          component={CommunityCareLanguagePage}
        />
        <Route
          path={`${match.url}/choose-closest-city`}
          component={ClosestCityStatePage}
        />
        <Route path={`${match.url}/clinics`} component={ClinicChoicePage} />
        <Route
          path={`${match.url}/reason-appointment`}
          component={ReasonForAppointmentPage}
        />
        <Route path={`${match.url}/review`} component={ReviewPage} />
        <Route
          path={`${match.url}/confirmation`}
          component={ConfirmationPage}
        />
        <Route path="/" component={TypeOfCarePage} />
      </Switch>
    </FormLayout>
  );
}

export const reducer = newAppointmentReducer;
