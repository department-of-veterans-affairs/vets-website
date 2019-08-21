import React from 'react';
import { Route, IndexRoute } from 'react-router';
import VAOSApp from './containers/VAOSApp';
import Index from './containers/Main';
import NewAppointmentLayout from './components/NewAppointmentLayout';
import TypeOfAppointmentPage from './containers/TypeOfAppointmentPage';

const routes = (
  <Route path="/" component={VAOSApp}>
    <IndexRoute component={Index} />
    <Route path="new-appointment" component={NewAppointmentLayout}>
      <IndexRoute component={TypeOfAppointmentPage} />
    </Route>
  </Route>
);

export default routes;
