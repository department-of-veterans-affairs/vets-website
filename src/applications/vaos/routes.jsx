import React from 'react';
import { Route, IndexRoute } from 'react-router';
import LandingPage from './components/LandingPage';
import NewAppointmentLayout from './components/NewAppointmentLayout';
import AppointmentListsPage from './containers/AppointmentListsPage';
// import TypeOfAppointmentPage from './containers/TypeOfAppointmentPage';
import TypeOfCarePage from './containers/TypeOfCarePage';
import CommunityCareProviderPage from './containers/CommunityCareProviderPage';
import PendingAppointmentListPage from './containers/PendingAppointmentListPage';
import PendingAppointmentDetailPage from './containers/PendingAppointmentDetailPage';
import ConfirmedAppointmentDetailPage from './containers/ConfirmedAppointmentDetailPage';
import ConfirmedAppointmentListPage from './containers/ConfirmedAppointmentListPage';
import TypeOfAudiologyCarePage from './containers/TypeOfAudiologyCarePage';
import TypeOfFacilityPage from './containers/TypeOfFacilityPage';
import ContactInfoPage from './containers/ContactInfoPage';

const routes = (
  <Route path="/">
    <IndexRoute component={LandingPage} />
    <Route path="new-appointment" component={NewAppointmentLayout}>
      <IndexRoute component={TypeOfCarePage} />
      <Route path="contact-info" component={ContactInfoPage} />
      <Route path="choose-facility-type" component={TypeOfFacilityPage} />
      <Route path="audiology" component={TypeOfAudiologyCarePage} />
      <Route
        path="community-care-provider"
        component={CommunityCareProviderPage}
      />
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
