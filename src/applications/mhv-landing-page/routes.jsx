/* eslint-disable @department-of-veterans-affairs/no-cross-app-imports */
import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import asyncLoader from '@department-of-veterans-affairs/platform-utilities/asyncLoader';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';
import LandingPageContainer from './containers/LandingPageContainer';

const AsyncSecureMessagingRoutes = asyncLoader(() =>
  import('../mhv-secure-messaging/routes').then(
    ({ default: MhvSecureMessagingRoutes }) => {
      return MhvSecureMessagingRoutes;
    },
  ),
);

const AsyncAppointmentsRoutes = asyncLoader(() =>
  import('../vaos/routes').then(({ default: AppointmentsRoutes }) => {
    return AppointmentsRoutes;
  }),
);

const AsyncMhvMedicationsRoutes = asyncLoader(() =>
  import('../mhv-medications/routes').then(
    ({ default: MhvMedicationsRoutes }) => {
      return MhvMedicationsRoutes;
    },
  ),
);

const AsyncMhvMedicalRecordsRoutes = asyncLoader(() =>
  import('../mhv-medical-records/routes').then(
    ({ default: MhvMedicalRecordsRoutes }) => {
      return MhvMedicalRecordsRoutes;
    },
  ),
);

const routes = () => (
  <AppConfig>
    <Routes>
      <Route path="/" element={<LandingPageContainer />} />
      <Route
        exact
        path={'/my-medications/*'}
        element={<AsyncMhvMedicationsRoutes />}
        key="mhvMedications"
      />
      <Route
        exact
        path={'/my-medical-records/*'}
        element={<AsyncMhvMedicalRecordsRoutes />}
        key="mhvMedicalRecords"
      />
      <Route
        path="/my-secure-messages/*"
        element={<AsyncSecureMessagingRoutes />}
        key="mhvSecureMessages"
      />
      <Route
        path="/my-appointments/*"
        element={<AsyncAppointmentsRoutes />}
        key="appointments"
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </AppConfig>
);

export default routes;
