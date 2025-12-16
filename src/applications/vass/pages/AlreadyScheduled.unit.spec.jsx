import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import { vassApi } from '../redux/api/vassApi';
import reducers from '../redux/reducers';

import AlreadyScheduled from './AlreadyScheduled';

describe('VASS Component: AlreadyScheduled', () => {
  it('should render all content', () => {
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
    expect(dateTimeElement.textContent).to.include('05/01/2025');
    expect(dateTimeElement.textContent).to.include('09:00 AM');
    expect(getByTestId('already-scheduled-reschedule-message')).to.exist;
    expect(getByTestId('already-scheduled-cancel-button')).to.exist;
  });
});
