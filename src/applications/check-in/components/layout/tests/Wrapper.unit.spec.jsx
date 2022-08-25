import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Wrapper from '../Wrapper';

describe('Wrapper component', () => {
  let store;
  const initState = {
    checkInData: {
      app: 'PreCheckIn',
    },
  };
  const middleware = [];
  const mockStore = configureStore(middleware);
  beforeEach(() => {
    store = mockStore(initState);
  });
  it('check in button passes axeCheck', () => {
    axeCheck(
      <Provider store={store}>
        <Wrapper />
      </Provider>,
    );
  });
  it('renders the passed in page title', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Wrapper pageTitle="Test Title" />
      </Provider>,
    );
    expect(getByText('Test Title')).to.exist;
  });
});
