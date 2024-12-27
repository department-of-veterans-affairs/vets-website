import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import POARequestsPage from '../../../components/POARequestsCard/POARequestsCard';
// import { poaRequestsLoader } from '../../../containers/POARequestsPage';
import mockPOARequestsResponse from '../../../mocks/mockPOARequestsResponse.json';
import ErrorMessage from '../../../components/common/ErrorMessage';

describe('POARequestsTable', () => {
  it('loads error component on POA requests page', async () => {
    const routes = [
      {
        path: '/representative/poa-requests',
        element: <POARequestsPage />,
        loader: mockPOARequestsResponse,
        errorElement: <ErrorMessage />,
      },
    ];
    const router = createMemoryRouter(routes);

    const { getByTestId } = await render(<RouterProvider router={router} />);
    await expect(getByTestId('error-message')).to.exist;
  });
});
