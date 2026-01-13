import React from 'react';
import { expect } from 'chai';
import { format } from 'date-fns';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import { vassApi } from '../redux/api/vassApi';
import reducers from '../redux/reducers';

import AlreadyScheduled from './AlreadyScheduled';

describe('VASS Component: AlreadyScheduled', () => {
  beforeEach(() => {
    mockFetch();
    localStorage.removeItem('token');
  });

  afterEach(() => {
    resetFetch();
    localStorage.removeItem('token');
  });

  it('should render all content with API data', async () => {
    // Use the same UTC timestamp as the component to compute expected values
    const appointmentDateUtc = '2025-05-01T16:00:00.000Z';
    const appointmentDate = new Date(appointmentDateUtc);
    const expectedDate = format(appointmentDate, 'MM/dd/yyyy');
    const expectedTime = format(appointmentDate, 'hh:mm a');

    // Mock API response
    setFetchJSONResponse(global.fetch, {
      data: {
        appointmentId: 'existing123',
        dtStartUtc: appointmentDateUtc,
        phoneNumber: '8008270611',
        typeOfCare: 'Solid Start',
        topics: [
          { topicId: '123', topicName: 'Benefits' },
          { topicId: '456', topicName: 'Health care' },
        ],
      },
    });

    const { getByTestId } = renderWithStoreAndRouterV6(<AlreadyScheduled />, {
      initialState: {
        vassForm: {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
        },
      },
      reducers,
      additionalMiddlewares: [vassApi.middleware],
    });

    await waitFor(() => {
      expect(getByTestId('already-scheduled-page')).to.exist;
    });

    // Wait for API to load and phone number to appear (success state)
    await waitFor(() => {
      expect(getByTestId('already-scheduled-phone-number')).to.exist;
    });
    const dateTimeElement = getByTestId('already-scheduled-date-time');
    expect(dateTimeElement.textContent).to.include(expectedDate);
    expect(dateTimeElement.textContent).to.include(expectedTime);
    expect(getByTestId('already-scheduled-reschedule-message')).to.exist;
    expect(getByTestId('already-scheduled-cancel-button')).to.exist;
  });

  it('should show loading indicator while fetching appointment', () => {
    const { getByTestId } = renderWithStoreAndRouterV6(<AlreadyScheduled />, {
      initialState: {
        vassForm: {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
        },
      },
      reducers,
      additionalMiddlewares: [vassApi.middleware],
    });

    expect(getByTestId('loading-indicator')).to.exist;
  });

  it('should show error alert when API fails', async () => {
    // Mock API error
    setFetchJSONFailure(global.fetch, {
      errors: [
        {
          code: 'server_error',
          detail: 'Internal server error',
          status: 500,
        },
      ],
    });

    const { getByTestId } = renderWithStoreAndRouterV6(<AlreadyScheduled />, {
      initialState: {
        vassForm: {
          hydrated: false,
          selectedDate: null,
          selectedTopics: [],
        },
      },
      reducers,
      additionalMiddlewares: [vassApi.middleware],
    });

    await waitFor(() => {
      expect(getByTestId('error-alert')).to.exist;
    });

    expect(getByTestId('error-alert').textContent).to.match(
      /We[’']re sorry\. We can(?:'|’|`)t access your appointment information right now/i,
    );
  });
});
