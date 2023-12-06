import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';

import App from './containers/App';

const routes = (
  <Routes>
    <Route path="/" element={<App />} />
  </Routes>
);

export default routes;
