import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import TopicSelection from './TopicSelection';

describe('VASS Component: TopicSelection', () => {
  it('should render page title', () => {
    const screen = renderWithStoreAndRouter(<TopicSelection />, {
      initialState: {},
    });

    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('back-link')).to.exist;
  });
});
