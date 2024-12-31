import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import POARequestsCard from '../../../components/POARequestsCard/POARequestsCard';
import mockPOARequestsResponse from '../../../mocks/mockPOARequestsResponse.json';
import ErrorMessage from '../../../components/common/ErrorMessage';

describe('POARequestsTable', () => {
  it('loads error component on POA requests page', async () => {
    const routes = [
      {
        path: '/representative/poa-requests',
        element: <POARequestsCard />,
        loader: mockPOARequestsResponse,
        errorElement: <ErrorMessage />,
      },
    ];
    const router = createMemoryRouter(routes);

    const { getByTestId } = render(<RouterProvider router={router} />);
    expect(getByTestId('error-message')).to.exist;
  });
});
