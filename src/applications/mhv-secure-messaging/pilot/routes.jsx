import React from 'react';
import { Routes, Route } from 'react-router-dom-v5-compat';
import App from '../containers/App';

const routes = (
  <Routes>
    <Route path="/" key="App">
      <App isPilot />
    </Route>
  </Routes>
);

export default routes;
