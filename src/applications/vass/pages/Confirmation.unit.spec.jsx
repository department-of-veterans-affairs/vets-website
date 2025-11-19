import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import Confirmation from './Confirmation';

describe('VASS Component: Confirmation', () => {
  it('should render page title', () => {
    const screen = renderWithStoreAndRouter(<Confirmation />, {
      initialState: {},
    });

    expect(screen.getByTestId('header')).to.exist;
  });
});
