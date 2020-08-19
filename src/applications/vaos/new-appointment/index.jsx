import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import newAppointmentReducer from '../reducers/newAppointment';
import NewAppointmentLayout from '../containers/NewAppointmentLayout';
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

export function NewAppointment() {
  const match = useRouteMatch();

  return (
    <NewAppointmentLayout>
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

export const reducer = newAppointmentReducer;
