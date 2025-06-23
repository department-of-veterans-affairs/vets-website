import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import { MhvPageNotFound } from '@department-of-veterans-affairs/mhv/exports';
import AppIsDown from './containers/AppIsDown';

const routes = (
  <Routes>
    <Route path="/" element={<AppIsDown />} />
    <Route path="*" element={<MhvPageNotFound />} />
  </Routes>
);

export default routes;
