import React from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
} from 'react-router-dom';
import {
  selectUseFlatFacilityPage,
  selectIsCernerOnlyPatient,
  selectUseProviderSelection,
} from '../redux/selectors';
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
import VAFacilityPage from './components/VAFacilityPage';
import VAFacilityPageV2 from './components/VAFacilityPage/VAFacilityPageV2';
import CommunityCarePreferencesPage from './components/CommunityCarePreferencesPage';
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

function NewAppointmentSection({
  flatFacilityPageEnabled,
  isCernerOnlyPatient,
  providerSelectionEnabled,
}) {
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
      !location.pathname.endsWith('new-appointment') &&
      !location.pathname.endsWith('confirmation'),
  });

  if (shouldRedirectToStart) {
    return <Redirect to="/new-appointment" />;
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
        {!flatFacilityPageEnabled && (
          <Route path={`${match.url}/va-facility`} component={VAFacilityPage} />
        )}
        {flatFacilityPageEnabled && (
          <Route
            path={`${match.url}/va-facility-2`}
            component={VAFacilityPageV2}
          />
        )}
        {!providerSelectionEnabled && (
          <Route
            path={`${match.url}/community-care-preferences`}
            component={CommunityCarePreferencesPage}
          />
        )}
        {providerSelectionEnabled && (
          <Route
            path={`${match.url}/community-care-preferences`}
            component={CommunityCareProviderSelectionPage}
          />
        )}
        {providerSelectionEnabled && (
          <Route
            path={`${match.url}/community-care-language`}
            component={CommunityCareLanguagePage}
          />
        )}
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

function mapStateToProps(state) {
  return {
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    flatFacilityPageEnabled: selectUseFlatFacilityPage(state),
    providerSelectionEnabled: selectUseProviderSelection(state),
  };
}

export const NewAppointment = connect(mapStateToProps)(NewAppointmentSection);

export const reducer = newAppointmentReducer;
