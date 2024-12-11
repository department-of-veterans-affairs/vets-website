import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import LoginHeader from 'platform/user/authentication/components/LoginHeader';

const generateState = ({ toggledOn = false }) => ({
  featureToggles: {
    // eslint-disable-next-line camelcase
    profile_hide_direct_deposit_comp_and_pen: toggledOn,
  },
});

describe('LoginHeader', () => {
  it('should render', () => {
    const screen = renderInReduxProvider(<LoginHeader />, {
      initialState: generateState({}),
    });

    expect(screen.queryByText(/Sign in or create an account/)).to.not.be.null;
  });
});
