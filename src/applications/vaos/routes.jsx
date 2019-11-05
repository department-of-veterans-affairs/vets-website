import React from 'react';
import { Route, IndexRoute } from 'react-router';
import LandingPage from './components/LandingPage';
import NewAppointmentLayout from './components/NewAppointmentLayout';
import AppointmentListsPage from './containers/AppointmentListsPage';
import ReasonForAppointmentPage from './containers/ReasonForAppointmentPage';
import TypeOfCarePage from './containers/TypeOfCarePage';
import CommunityCareProviderPage from './containers/CommunityCareProviderPage';
import CommunityCarePreferencesPage from './containers/CommunityCarePreferencesPage';
import PendingAppointmentListPage from './containers/PendingAppointmentListPage';
import PendingAppointmentDetailPage from './containers/PendingAppointmentDetailPage';
import ConfirmedAppointmentDetailPage from './containers/ConfirmedAppointmentDetailPage';
import ConfirmedAppointmentListPage from './containers/ConfirmedAppointmentListPage';
import TypeOfAudiologyCarePage from './containers/TypeOfAudiologyCarePage';
import TypeOfFacilityPage from './containers/TypeOfFacilityPage';
import ContactInfoPage from './containers/ContactInfoPage';
import VAFacilityPage from './containers/VAFacilityPage';
import TypeOfVisitPage from './containers/TypeOfVisitPage';
import ReviewPage from './containers/ReviewPage';
import ClinicChoicePage from './containers/ClinicChoicePage';
import TypeOfSleepCarePage from './containers/TypeOfSleepCarePage';
import DateTimeRequestPage from './containers/DateTimeRequestPage';
import DateTimeSelectPage from './containers/DateTimeSelectPage';

const routes = (
  <Route path="/">
    <IndexRoute component={LandingPage} />
    <Route path="new-appointment" component={NewAppointmentLayout}>
      <Route path="reason-appointment" component={ReasonForAppointmentPage} />
      <IndexRoute component={TypeOfCarePage} />
      <Route path="contact-info" component={ContactInfoPage} />
      <Route path="choose-facility-type" component={TypeOfFacilityPage} />
      <Route path="choose-visit-type" component={TypeOfVisitPage} />
      <Route path="choose-sleep-care" component={TypeOfSleepCarePage} />
      <Route path="audiology" component={TypeOfAudiologyCarePage} />
      <Route path="request-date" component={DateTimeRequestPage} />
      <Route path="select-date" component={DateTimeSelectPage} />
      <Route
        path="community-care-provider"
        component={CommunityCareProviderPage}
      />
      <Route path="va-facility" component={VAFacilityPage} />
      <Route
        path="community-care-preferences"
        component={CommunityCarePreferencesPage}
      />
      <Route path="clinics" component={ClinicChoicePage} />
      <Route path="review" component={ReviewPage} />
    </Route>
    <Route path="appointments" component={AppointmentListsPage} />
    <Route path="appointments/pending" component={PendingAppointmentListPage} />
    <Route
      path="appointments/pending/:id"
      component={PendingAppointmentDetailPage}
    />
    <Route
      path="appointments/confirmed/:id"
      component={ConfirmedAppointmentDetailPage}
    />
    <Route
      path="appointments/confirmed"
      component={ConfirmedAppointmentListPage}
    />
  </Route>
);

export default routes;
