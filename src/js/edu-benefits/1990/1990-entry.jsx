import React from 'react';
import { IndexRedirect, Route } from 'react-router';

import EduBenefitsApp from './containers/EduBenefitsApp.jsx';
import routes from './routes.jsx';

export default function Form1990Entry() {
  return (
    <Route path="/" component={EduBenefitsApp}>
      <IndexRedirect to="/introduction"/>
      {routes}
    </Route>
  );
}
