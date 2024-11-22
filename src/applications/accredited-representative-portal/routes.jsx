import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './containers/App';
import POARequestsPage from './pages/POARequestsPage';
import { poaRequestsLoader } from './loaders/poaRequestsLoader';
import { userLoader } from './loaders/userLoader';

const router = createBrowserRouter([
  {
    path: '/representative',
    element: <App />,
    loader: userLoader,
    children: [
      {
        path: 'poa-requests',
        element: <POARequestsPage />,
        loader: poaRequestsLoader,
      },
    ],
  },
]);

export default router;
