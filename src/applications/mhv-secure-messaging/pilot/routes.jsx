import React from 'react';
import { Routes, Route } from 'react-router-dom-v5-compat';
import App from '../containers/App';

const routes = (
  <Routes>
    <Route path="/*" element={<App isPilot />} key="App" />
  </Routes>
);

export default routes;
