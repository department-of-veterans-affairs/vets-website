import React from 'react';
import { Route } from 'react-router';
import { Routes } from 'react-router-dom-v5-compat';
import LandingPage from './components/page/LandingPage';
import AvaFormPage from './components/page/AvaFormPage';

const routes = (
  <Routes>
    <Route path="/" component={LandingPage} />
    <Route path="/inquiry" component={AvaFormPage} />
  </Routes>
);

export default routes;
