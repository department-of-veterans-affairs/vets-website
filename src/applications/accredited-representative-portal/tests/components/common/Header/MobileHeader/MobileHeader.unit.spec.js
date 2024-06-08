import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import MobileHeader from '../../../../../components/common/Header/MobileHeader/MobileHeader';

const mockStore = configureStore([]);
const initialState = {
  user: {
    isLoading: false,
    profile: null,
  },
};

describe('MobileHeader', () => {
  const getMobileHeader = () => {
    const store = mockStore(initialState);
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <MobileHeader />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('renders header on mobile', () => {
    const { getByTestId } = getMobileHeader();
    expect(getByTestId('mobile-header')).to.exist;
  });
});
