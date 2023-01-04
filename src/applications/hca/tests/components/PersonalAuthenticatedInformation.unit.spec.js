import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import PersonalAuthenticatedInformation from '../../components/PersonalAuthenticatedInformation';

describe('hca <PersonalAuthenticatedInformation>', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);

  it('should render name and date of birth when user is logged in and date of birth has a value', () => {
    const userDob = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          userFullName: {
            first: 'John',
            middle: 'Marjorie',
            last: 'Smith',
            suffix: 'Sr.',
          },
          dob: '1990-11-24',
        },
      },
    };
    const store = mockStore(userDob);

    const { getByText } = render(
      <Provider store={store}>
        <PersonalAuthenticatedInformation />
      </Provider>,
    );
    expect(getByText(/john marjorie smith sr./i)).to.exist;
    expect(getByText(/november 24, 1990/i)).to.exist;
  });

  it('should render name and not date of birth when user is logged in and date of birth does not have a value', () => {
    const user = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          userFullName: {
            first: 'John',
            middle: 'Marjorie',
            last: 'Smith',
            suffix: 'Sr.',
          },
        },
      },
    };
    const store = mockStore(user);

    const view = render(
      <Provider store={store}>
        <PersonalAuthenticatedInformation />
      </Provider>,
    );

    expect(view.container.querySelector('[data-testid="hca-veteran-fullname"]'))
      .to.exist;
    expect(
      view.container.querySelector('[data-testid="hca-veteran-fullname"]'),
    ).to.contain.text('John Marjorie Smith Sr.');
    expect(view.container.querySelector('[data-testid="hca-veteran-dob"]')).to
      .not.exist;
  });

  it('should not render name and date of birth when user is not logged in', () => {
    const notLoggedIn = {
      user: {
        login: {
          currentlyLoggedIn: false,
        },
        profile: {
          userFullName: {},
        },
      },
    };
    const store = mockStore(notLoggedIn);

    const view = render(
      <Provider store={store}>
        <PersonalAuthenticatedInformation />
      </Provider>,
    );

    expect(view.container.querySelector('[data-testid="hca-veteran-fullname"]'))
      .to.not.exist;
    expect(view.container.querySelector('[data-testid="hca-veteran-dob"]')).to
      .not.exist;
  });
});
