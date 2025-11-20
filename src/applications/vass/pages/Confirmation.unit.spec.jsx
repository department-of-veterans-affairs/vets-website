import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import Confirmation from './Confirmation';

describe('VASS Component: Confirmation', () => {
  it('should render all content', () => {
    const { getByTestId } = renderWithStoreAndRouter(<Confirmation />, {
      initialState: {},
    });

    expect(getByTestId('header')).to.exist;
    expect(getByTestId('confirmation-message')).to.exist;
    expect(getByTestId('appointment-card')).to.exist;
    expect(getByTestId('appointment-type')).to.exist;
    expect(getByTestId('how-to-join-section')).to.exist;
    expect(getByTestId('when-section')).to.exist;
    expect(getByTestId('what-section')).to.exist;
    expect(getByTestId('who-section')).to.exist;
    expect(getByTestId('topics-section')).to.exist;
    expect(getByTestId('print-button')).to.exist;
    expect(getByTestId('cancel-button')).to.exist;
  });
});
