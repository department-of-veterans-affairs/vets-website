import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import Review from './Review';

describe('VASS Component: Review', () => {
  it('should render review page correctly', () => {
    const screen = renderWithStoreAndRouter(<Review />, {
      initialState: {},
    });
    expect(screen.getByTestId('review-page')).to.exist;
    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('solid-start-call-title')).to.exist;
    expect(screen.getByTestId('solid-start-call-description')).to.exist;
    expect(screen.getByTestId('date-time-title')).to.exist;
    expect(screen.getByTestId('date-time-edit-link')).to.exist;
    expect(screen.getByTestId('date-time-description')).to.exist;
    expect(screen.getByTestId('topic-title')).to.exist;
    expect(screen.getByTestId('topic-edit-link')).to.exist;
    expect(screen.getByTestId('topic-description')).to.exist;
    expect(screen.getByTestId('confirm-call-button')).to.exist;
  });
});
