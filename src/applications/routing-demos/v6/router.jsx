import React from 'react';
import { createBrowserRouter } from 'react-router-dom-v5-compat';

// import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';

import About from './containers/About';
import App from './containers/App';
import PrescriptionInfo from './containers/PrescriptionInfo';
import Prescriptions from './containers/Prescriptions';
import { authenticatedLoader } from './loaders/authenticatedLoader';
import { prescriptionLoader } from './loaders/prescriptionLoader';
import { prescriptionsLoader } from './loaders/prescriptionsLoader';

const router = createBrowserRouter([
  {
    path: '/routing-demos/v6/',
    element: <App />,
    children: [
      {
        index: true,
        element: <About />,
      },
      {
        path: 'prescriptions',
        element: <Prescriptions />,
        loader: authenticatedLoader(prescriptionsLoader),
      },
      {
        path: 'prescription/:id',
        loader: authenticatedLoader(prescriptionLoader),
        lazy: () => import('./containers/Prescription'),
      },
      {
        path: 'prescription/:id/info',
        element: <PrescriptionInfo />,
        loader: authenticatedLoader(prescriptionLoader),
      },
    ],
  },
]);

export default router;
