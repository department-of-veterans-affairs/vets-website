import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import DateTimeSelection from './DateTimeSelection';

describe('VASS Component: DateTimeSelection', () => {
  it('should render page title', () => {
    const screen = renderWithStoreAndRouter(<DateTimeSelection />, {
      initialState: {},
    });

    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('back-link')).to.exist;
  });
});
