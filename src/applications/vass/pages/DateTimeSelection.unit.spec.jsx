import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import DateTimeSelection from './DateTimeSelection';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

describe('VASS Component: DateTimeSelection', () => {
  it('should render page title', () => {
    const screen = renderWithStoreAndRouter(<DateTimeSelection />, {
      initialState: {
        vassForm: {
          selectedDate: null,
          selectedTopics: [],
        },
      },
      reducers,
      additionalMiddlewares: [vassApi.middleware],
    });

    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('back-link')).to.exist;
  });
});
