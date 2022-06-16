import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Footer from '../Footer';

describe('check-in', () => {
  describe('Footer', () => {
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
          <Footer />
        </Provider>,
      );
    });
    it('renders additional information', () => {
      const { getByText } = render(
        <Provider store={store}>
          <Footer message={<p>foo</p>} />
        </Provider>,
      );
      expect(getByText('foo')).to.exist;
    });
  });
});
