import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import WelcomeContainer from '../../containers/WelcomeContainer';
import reducers from '../../reducers';

const stateFn = ({
  loading = false,
  preferredName = 'Bob',
  first = 'Robert',
} = {}) => ({
  myHealth: {
    personalInformation: {
      data: {
        preferredName,
      },
      loading,
    },
  },
  user: {
    profile: {
      loa: {
        current: 3,
      },
      status: 'OK',
      userFullName: {
        first,
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
  it('renders', () => {
    const { getByRole } = setup();
    getByRole('heading', { name: /Welcome, Bob/ });
  });

  it('is hidden, holding vertical space, while loading', () => {
    const state = stateFn({ loading: true });
    const { container } = setup(state);
    expect(container.firstChild.classList.contains('visibility:hidden')).to.be
      .true;
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
