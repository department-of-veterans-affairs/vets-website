import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import Welcome from '../../containers/Welcome';
import reducers from '../../reducers';

const stateFn = ({ preferredName = 'Bob', first = 'Robert' } = {}) => ({
  myHealth: {
    personalInformation: {
      data: {
        preferredName,
      },
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
  renderInReduxProvider(<Welcome {...props} />, { initialState, reducers });

describe('Welcome component', () => {
  it('renders', () => {
    const { getByRole } = setup();
    getByRole('heading', { name: /Welcome, Bob/ });
  });

  it("masks the user's name from datadog (no PII)", () => {
    const { getByText } = setup();
    const result = getByText('Bob').getAttribute('data-dd-privacy');
    expect(result).to.eq('mask');
  });

  it('renders when name is not supplied', () => {
    const initialState = stateFn({ preferredName: null, first: null });
    const { getByRole } = setup(initialState);
    getByRole('heading', { name: 'Welcome' });
  });
});
