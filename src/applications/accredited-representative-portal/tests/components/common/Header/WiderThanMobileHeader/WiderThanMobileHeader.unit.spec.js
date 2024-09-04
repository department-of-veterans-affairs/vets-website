import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import WiderThanMobileLogoRow from '../../../../../components/common/Header/WiderThanMobileHeader/WiderThanMobileLogoRow';

const mockStore = configureStore([]);
const initialState = {
  user: {
    isLoading: false,
    profile: null, // You can adjust this based on the expected state in your component
  },
};
describe('WiderThanMobileLogoRow', () => {
  const getWiderThanMobileLogoRow = () => {
    const store = mockStore(initialState);
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <WiderThanMobileLogoRow />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('renders logo', () => {
    const { getByTestId } = getWiderThanMobileLogoRow();
    expect(getByTestId('wider-than-mobile-logo-row-logo')).to.exist;
  });

  it('renders sign in link', () => {
    const { getByTestId } = getWiderThanMobileLogoRow();
    expect(
      getByTestId('user-nav-wider-than-mobile-sign-in-link').textContent,
    ).to.eq('Sign in');
  });
});
