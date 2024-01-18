import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import environment from 'platform/utilities/environment';

import FacilitySearch from '../../../components/FormFields/FacilitySearch';

describe('<FacilitySearch />', () => {
  const mockApiResponse = [-81.8589528, 27.920797, -81.704274, 28.051356];
  let server;
  const adjustedBoundaryCoordinates = [
    // min X
    mockApiResponse[0] - 0.3,
    // min Y
    mockApiResponse[1] - 0.3,
    // max X
    mockApiResponse[2] + 0.3,
    // max Y
    mockApiResponse[3] + 0.3,
  ];

  before(() => {
    server = setupServer(
      rest.get(
        `${environment.API_URL}/v1/facilities/va?bbox%5B%5D=${
          adjustedBoundaryCoordinates[0]
        }%2C%20${adjustedBoundaryCoordinates[1]}%2C%20${
          adjustedBoundaryCoordinates[2]
        }%2C%20${adjustedBoundaryCoordinates[3]}&per_page=500`,
        (req, res, ctx) => {
          return res(ctx.json(mockApiResponse));
        },
      ),
    );

    server.listen();
  });

  afterEach(() => server.resetHandlers());

  after(() => {
    server.close();
  });

  it('renders without crashing', () => {
    const { getByRole } = render(<FacilitySearch />);
    expect(getByRole('search')).to.exist;
  });

  it('displays error message with empty input', async () => {
    const { getByText, container } = render(<FacilitySearch />);
    fireEvent.click(getByText('Search'));
    await waitFor(() => {
      // Custom query to find the element with the error message
      const errorMessageElement = container.querySelector(
        '[error="Please provide a city, state or postal code"]',
      );
      expect(errorMessageElement).to.exist;
      // You can add more assertions here if needed
    });
  });
});
