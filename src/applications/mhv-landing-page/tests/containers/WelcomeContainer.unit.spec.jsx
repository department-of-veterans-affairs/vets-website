import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import WelcomeContainer from '../../containers/WelcomeContainer';
import reducers from '../../reducers';

const stateFn = ({ preferredName = 'Bob', first = 'Robert' } = {}) => ({
  user: {
    profile: {
      loa: {
        current: 3,
      },
      status: 'OK',
      userFullName: {
        first,
      },
      demographics: {
        preferredName,
      },
    },
  },
});

const setup = (initialState = stateFn(), props = {}) =>
  renderInReduxProvider(<WelcomeContainer {...props} />, {
    initialState,
    reducers,
  });

describe('WelcomeContainer component', () => {
  it('renders with preferred name', () => {
    const { getByRole } = setup();
    getByRole('heading', { name: /Welcome, Bob/ });
  });

  it("masks the user's name from datadog (no PII)", () => {
    const { getByText } = setup();
    const result = getByText('Bob').getAttribute('data-dd-privacy');
    expect(result).to.eq('mask');
  });

  it('renders when preferred name is not available', () => {
    const initialState = stateFn({ preferredName: null });
    const { getByRole } = setup(initialState);
    getByRole('heading', { name: 'Welcome, Robert' });
  });

  it('renders when name is not supplied', () => {
    const initialState = stateFn({ preferredName: null, first: null });
    const { getByRole } = setup(initialState);
    getByRole('heading', { name: 'Welcome' });
  });
});
