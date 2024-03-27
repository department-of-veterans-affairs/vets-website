/* eslint-disable camelcase */
import React from 'react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { MyHealthAccessGuard } from '../util/route-guard';
import reducers from '~/applications/mhv-landing-page/reducers';

const stateFn = ({ loa = 3, facilities = ['123'] } = {}) => ({
  user: {
    profile: {
      loa: {
        current: loa,
      },
      facilities,
    },
  },
});

const setup = ({
  initialState = stateFn(),
  children = <div>Protected Content</div>,
} = {}) =>
  renderInReduxProvider(<MyHealthAccessGuard>{children}</MyHealthAccessGuard>, {
    initialState,
    reducers,
  });

describe('MyHealthAccessGuard component', () => {
  it('should render children when user is verified and has health data', () => {
    const { getByText } = setup();
    expect(getByText('Protected Content')).to.exist;
  });

  it('should redirect to "/my-health" when user is unverified', () => {
    const initialState = stateFn({ loa: 1 });
    const { queryByText } = setup({ initialState });
    expect(queryByText('Protected Content')).to.not.exist;
  });

  it('should redirect to "/my-health" when user does not have health data', () => {
    const initialState = stateFn({ facilities: [] });
    const { queryByText } = setup({ initialState });
    expect(queryByText('Protected Content')).to.not.exist;
  });
});
