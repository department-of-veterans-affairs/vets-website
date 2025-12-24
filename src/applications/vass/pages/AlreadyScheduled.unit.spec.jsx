import React from 'react';
import { expect } from 'chai';
import { format } from 'date-fns';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import { vassApi } from '../redux/api/vassApi';
import reducers from '../redux/reducers';

import AlreadyScheduled from './AlreadyScheduled';

describe('VASS Component: AlreadyScheduled', () => {
  it('should render all content', () => {
    // Use the same UTC timestamp as the component to compute expected values
    // This ensures the test works regardless of the timezone it runs in
    const appointmentDateUtc = '2025-05-01T16:00:00.000Z';
    const appointmentDate = new Date(appointmentDateUtc);
    const expectedDate = format(appointmentDate, 'MM/dd/yyyy');
    const expectedTime = format(appointmentDate, 'hh:mm a');

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
    expect(getByTestId('already-scheduled-page')).to.exist;
    expect(getByTestId('already-scheduled-phone-number')).to.exist;
    const dateTimeElement = getByTestId('already-scheduled-date-time');
    expect(dateTimeElement.textContent).to.include(expectedDate);
    expect(dateTimeElement.textContent).to.include(expectedTime);
    expect(getByTestId('already-scheduled-reschedule-message')).to.exist;
    expect(getByTestId('already-scheduled-cancel-button')).to.exist;
  });
});
