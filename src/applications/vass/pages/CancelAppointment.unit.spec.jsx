import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import CancelAppointment from './CancelAppointment';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

const defaultRenderOptions = {
  initialState: {
    vassForm: {
      hydrated: false,
      selectedDate: null,
      selectedTopics: [],
    },
  },
  reducers,
  additionalMiddlewares: [vassApi.middleware],
};

describe('VASS Page: CancelAppointment', () => {
  it('renders page, appointment card, and buttons', () => {
    const screen = renderWithStoreAndRouter(
      <CancelAppointment />,
      defaultRenderOptions,
    );

    expect(screen.getByTestId('cancel-appointment-page')).to.exist;
    expect(screen.getByTestId('header').textContent).to.contain(
      'Would you like to cancel this appointment?',
    );
    expect(screen.getByTestId('appointment-card')).to.exist;
    expect(screen.getByTestId('cancel-confirm-button-pair')).to.exist;
  });
});
