import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import CancelConfirmation from './CancelConfirmation';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

describe('VASS Component: CancelConfirmation', () => {
  it('renders page, message, and appointment card', () => {
    const { getByTestId } = renderWithStoreAndRouter(<CancelConfirmation />, {
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
    expect(getByTestId('cancel-confirmation-page')).to.exist;
    expect(getByTestId('cancel-confirmation-message').textContent).to.match(
      /If you need to reschedule, call us at.*/i,
    );
    expect(getByTestId('cancel-confirmation-phone')).to.exist;
    expect(getByTestId('appointment-card')).to.exist;
  });
});
