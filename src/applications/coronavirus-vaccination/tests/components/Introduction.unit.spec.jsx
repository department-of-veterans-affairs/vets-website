import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import { Introduction } from '../../components/Introduction';
import reducer from '../../reducers';

const initialState = {
  user: {
    login: {
      currentlyLoggedIn: false,
    },
  },
  scheduledDowntime: {
    globalDowntime: null,
    isReady: true,
    isPending: false,
    serviceMap: {
      get() {},
    },
    dismissedDowntimeWarnings: [],
  },
};

describe('<Introduction/>', () => {
  it('renders without crashing', () => {
    const screen = renderInReduxProvider(<Introduction />, {
      initialState,
      reducers: reducer,
    });

    screen.getByText('COVID-19 vaccines: Stay informed and help us prepare');
  });
});
