import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import LandingPage from '../LandingPage';

// Redux state needs to have feature toggles since MHV links are resolved in LandingPage
const generateInitState = ({
  loading = false,
  mhvLandingPageEnabled = true,
}) => {
  return {
    featureToggles: {
      loading,
      // eslint-disable-next-line camelcase
      mhv_landing_page_enabled: mhvLandingPageEnabled,
    },
  };
};

describe('MHV landing page', () => {
  describe('LandingPage', () => {
    it('renders landing page container', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = generateInitState({
        loading: true,
      });
      const store = mockStore(initState);
      const { getByTestId } = render(
        <Provider store={store}>
          <LandingPage />
        </Provider>,
      );
      expect(getByTestId('landing-page-container')).to.exist;
    });
  });
});
