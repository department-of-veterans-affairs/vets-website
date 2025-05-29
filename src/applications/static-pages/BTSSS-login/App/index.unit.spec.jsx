import React from 'react';
import { expect } from 'chai';
import { fireEvent, cleanup } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import BTSSSApp from '.';

describe('BTSSS Widget', () => {
  afterEach(cleanup);

  it('renders va-alert-sign-in for unauthenticated user', () => {
    const { container } = renderInReduxProvider(<BTSSSApp />, {
      initialState: {
        user: { login: { currentLoggedIn: false } },
      },
    });
    expect(container.querySelector('va-alert-sign-in')).to.exist;
  });

  it('opens sign-in modal when Sign in button is clicked', () => {
    const { container } = renderInReduxProvider(<BTSSSApp />, {
      initialState: {
        user: { login: { currentlyLoggedIn: false } },
      },
    });
    const signInButton = container.querySelector('va-button');
    fireEvent.click(signInButton);
    expect(container.querySelector('va-button')).to.exist;
  });

  it('renders what we expect when authenticated', () => {
    const { container } = renderInReduxProvider(<BTSSSApp />, {
      initialState: {
        user: { login: { currentlyLoggedIn: true } },
      },
    });
    expect(container.querySelector('va-alert-sign-in')).to.not.exist;
  });

  it('does not render BTSSS info with SMOC flag on', () => {
    const screen = renderInReduxProvider(<BTSSSApp />, {
      initialState: {
        user: { login: { currentlyLoggedIn: true } },
        featureToggles: {
          loading: false,
          /* eslint-disable-next-line camelcase */
          travel_pay_submit_mileage_expense: true,
        },
      },
    });
    expect(
      screen.queryByText(
        'You can file a claim online through the Beneficiary Travel Self Service System (BTSSS).',
      ),
    ).to.not.exist;
  });
});
