import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import React from 'react';
import InterstitialPage from '../../containers/InterstitialPage';

describe('Interstitial page header', () => {
  const initialState = {
    sm: {},
  };
  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<InterstitialPage />, {
      initialState,
    });

    screen.getByText(
      'connect with our Veterans Crisis Line. We offer confidential support anytime day or night.',
      {
        exact: false,
      },
    );
  });
});
