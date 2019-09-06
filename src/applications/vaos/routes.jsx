import React from 'react';
import { Route, IndexRoute } from 'react-router';
import LandingPage from './components/LandingPage';
import NewAppointmentLayout from './components/NewAppointmentLayout';
import AppointmentListsPage from './containers/AppointmentListsPage';
import TypeOfAppointmentPage from './containers/TypeOfAppointmentPage';
import ContactInfoPage from './containers/ContactInfoPage';

const routes = (
  <Route path="/">
    <IndexRoute component={LandingPage} />
    <Route path="new-appointment" component={NewAppointmentLayout}>
      <IndexRoute component={TypeOfAppointmentPage} />
      <Route path="contact-info" component={ContactInfoPage} />
    </Route>
    <Route path="appointments" component={AppointmentListsPage} />
  </Route>
);

export default routes;
