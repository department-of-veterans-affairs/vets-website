import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';

import App from './containers/App';
import AppContent from './components/AppContent';

const routes = (
  <Routes>
    <Route path="/" element={<App />}>
      <Route index element={<AppContent />} />
    </Route>
  </Routes>
);

export default routes;
