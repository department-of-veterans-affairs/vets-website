import React from 'react';
import { createBrowserRouter } from 'react-router-dom-v5-compat';
// import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';

import About from './containers/About';
import App from './containers/App';
import Prescription from './containers/Prescription';
import PrescriptionInfo from './containers/PrescriptionInfo';
import Prescriptions from './containers/Prescriptions';
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
        loader: prescriptionsLoader,
      },
      {
        path: 'prescription/:id',
        element: <Prescription />,
        loader: prescriptionLoader,
      },
      {
        path: 'prescription/:id/info',
        element: <PrescriptionInfo />,
        loader: prescriptionLoader,
      },
    ],
  },
]);

export default router;
