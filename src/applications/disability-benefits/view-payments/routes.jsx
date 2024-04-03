import React from 'react';
import { Routes, Route } from 'react-router-dom-v5-compat';

import ViewPaymentsApp from './containers/App';

const routes = (
  <Routes>
    <Route path="/" element={<ViewPaymentsApp />} />;
  </Routes>
);

export default routes;
