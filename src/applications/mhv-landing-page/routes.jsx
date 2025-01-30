import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';
import LandingPageContainer from './containers/LandingPageContainer';

const routes = (
  <AppConfig>
    <Routes>
      <Route path="/" element={<LandingPageContainer />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </AppConfig>
);

export default routes;
