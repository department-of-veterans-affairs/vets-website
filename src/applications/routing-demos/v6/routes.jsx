import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';

import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';

import About from './containers/About';
import App from './containers/App';
import Prescriptions from './containers/Prescriptions';

const AboutRoute = (
  <App>
    <About />
  </App>
);
const PrescriptionsRoute = (
  <App>
    <Prescriptions />
  </App>
);

const routes = (
  <Routes>
    <Route path="/" element={AboutRoute} />
    <Route path="/prescriptions" element={PrescriptionsRoute} />
    <Route element={<PageNotFound />} />
  </Routes>
);

export default routes;
