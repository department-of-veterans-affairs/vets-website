import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import { MhvPageNotFound } from '@department-of-veterans-affairs/mhv/exports';
import AppConfig from './containers/AppConfig';
import LandingPageContainer from './containers/LandingPageContainer';

const routes = (
  <AppConfig>
    <Routes>
      <Route path="/" element={<LandingPageContainer />} />
      <Route path="*" element={<MhvPageNotFound />} />
    </Routes>
  </AppConfig>
);

export default routes;
