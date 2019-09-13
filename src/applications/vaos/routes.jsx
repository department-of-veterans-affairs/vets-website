import React from 'react';
import { Route, IndexRoute } from 'react-router';
import LandingPage from './components/LandingPage';
import NewAppointmentLayout from './components/NewAppointmentLayout';
import AppointmentListsPage from './containers/AppointmentListsPage';
// import TypeOfAppointmentPage from './containers/TypeOfAppointmentPage';
import TypeOfCarePage from './containers/TypeOfCarePage';
import PendingAppointmentsPage from './containers/PendingAppointmentsPage';
import PendingAppointmentPage from './containers/PendingAppointmentPage';
import ContactInfoPage from './containers/ContactInfoPage';

const routes = (
  <Route path="/">
    <IndexRoute component={LandingPage} />
    <Route path="new-appointment" component={NewAppointmentLayout}>
      <IndexRoute component={TypeOfCarePage} />
      <Route path="contact-info" component={ContactInfoPage} />
    </Route>
    <Route path="appointments" component={AppointmentListsPage} />
    <Route path="appointments/pending" component={PendingAppointmentsPage} />
    <Route path="appointments/pending/:id" component={PendingAppointmentPage} />
  </Route>
);

export default routes;
