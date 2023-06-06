import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import VeteranProfileInformation from '../../../components/FormPages/VeteranProfileInformation';

describe('hca VeteranProfileInformation', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);

  it('should render name and date of birth when user is logged in and date of birth has a value', () => {
    const data = {
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
    const store = mockStore(data);
    const { getByText } = render(
      <Provider store={store}>
        <VeteranProfileInformation />
      </Provider>,
    );
    expect(getByText(/john marjorie smith sr./i)).to.exist;
    expect(getByText(/november 24, 1990/i)).to.exist;
  });

  it('should render name and not date of birth when user is logged in and date of birth does not have a value', () => {
    const data = {
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
    const store = mockStore(data);
    const view = render(
      <Provider store={store}>
        <VeteranProfileInformation />
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
});
