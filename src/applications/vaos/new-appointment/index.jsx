import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { selectIsCernerOnlyPatient } from 'platform/user/selectors';
import newAppointmentReducer from '../reducers/newAppointment';
import NewAppointmentLayout from './components/NewAppointmentLayout';
import TypeOfCarePage from '../containers/TypeOfCarePage';
import ContactInfoPage from '../containers/ContactInfoPage';
import TypeOfVisitPage from '../containers/TypeOfVisitPage';
import TypeOfSleepCarePage from '../containers/TypeOfSleepCarePage';
import TypeOfEyeCarePage from '../containers/TypeOfEyeCarePage';
import TypeOfAudiologyCarePage from '../containers/TypeOfAudiologyCarePage';
import PreferredDatePage from '../containers/PreferredDatePage';
import DateTimeRequestPage from '../containers/DateTimeRequestPage';
import DateTimeSelectPage from '../containers/DateTimeSelectPage';
import VAFacilityPage from '../containers/VAFacilityPage';
import CommunityCarePreferencesPage from '../containers/CommunityCarePreferencesPage';
import ClinicChoicePage from '../containers/ClinicChoicePage';
import ReasonForAppointmentPage from '../containers/ReasonForAppointmentPage';
import ReviewPage from '../containers/ReviewPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import TypeOfFacilityPage from '../containers/TypeOfFacilityPage';

function onBeforeUnload(e) {
  const expirationDate = localStorage.getItem('sessionExpiration');
  const expirationDateSSO = localStorage.getItem('sessionExpirationSSO');

  // If there's no expiration date, then the session has already expired
  // and keeping a person on the form won't save their data
  if (expirationDate || expirationDateSSO) {
    e.preventDefault();
    e.returnValue =
      'Are you sure you wish to leave this application? All progress will be lost.';
  }
}

function NewAppointmentSection({ isCernerOnlyPatient }) {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(
    () => {
      if (location.pathname.endsWith('confirmation')) {
        window.removeEventListener('beforeunload', onBeforeUnload);
      }
    },
    [location],
  );

  useEffect(() => {
    if (isCernerOnlyPatient) {
      history.replace('/');
    }

    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }

    // We don't want people to start in the middle of the form, so redirect them when they jump
    // in the middle. We make an exception for the confirmation page in case someone is going back
    // after submitting.
    if (
      !location.pathname.endsWith('new-appointment') &&
      !location.pathname.endsWith('confirmation')
    ) {
      history.replace('/new-appointment');
    }

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  return (
    <NewAppointmentLayout isReviewPage={location.pathname.includes('review')}>
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
        <Route path={`${match.url}/va-facility`} component={VAFacilityPage} />
        <Route
          path={`${match.url}/community-care-preferences`}
          component={CommunityCarePreferencesPage}
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
    </NewAppointmentLayout>
  );
}

function mapStateToProps(state) {
  return {
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
  };
}

export const NewAppointment = connect(mapStateToProps)(NewAppointmentSection);

export const reducer = newAppointmentReducer;
