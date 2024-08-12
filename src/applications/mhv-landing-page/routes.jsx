import React from 'react';
import { Routes, Route } from 'react-router-dom-v5-compat';

import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';
// import ErrorBoundary from './containers/ErrorBoundary';
import LandingPageContainer from './containers/LandingPageContainer';
import MedicalRecordsContainer from './containers/MedicalRecordsContainer';

const routes = (
  // <ErrorBoundary>
  <AppConfig>
    <Routes>
      <Route path="/" element={<LandingPageContainer />} />
      <Route path="records" element={<MedicalRecordsContainer />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </AppConfig>
  // </ErrorBoundary>
);

export default routes;
