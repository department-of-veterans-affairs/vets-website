import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import AppConfig from './containers/AppConfig';
import LandingPageContainer from './containers/LandingPageContainer';
import PageNotFoundContainer from './containers/PageNotFoundContainer';

const routes = (
  <AppConfig>
    <Routes>
      <Route path="/" element={<LandingPageContainer />} />
      <Route path="*" element={<PageNotFoundContainer />} />
    </Routes>
  </AppConfig>
);

export default routes;
