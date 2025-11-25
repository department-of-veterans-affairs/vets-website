import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import Verify from './Verify';

describe('VASS Component: Verify', () => {
  it('should render all content', () => {
    const { getByTestId } = renderWithStoreAndRouterV6(<Verify />, {
      initialState: {},
    });

    expect(getByTestId('header')).to.exist;
    expect(getByTestId('verify-intro-text')).to.exist;
    expect(getByTestId('last-name-input')).to.exist;
    expect(getByTestId('dob-input')).to.exist;
    expect(getByTestId('submit-button')).to.exist;
  });
});
