import React from 'react';

import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import configureStore from 'redux-mock-store';
import TestComponent from './TestComponent';

describe('check-in', () => {
  describe('useSendTravelPayClaim hook', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        featureToggles: {
          /* eslint-disable-next-line camelcase */
          check_in_experience_travel_reimbursement: true,
        },
        checkInData: {
          context: {
            token: 'some-token',
            appointment: {
              startTime: '2022-08-12T15:15:00',
            },
          },
          form: {
            data: {
              demographicsUpToDate: 'yes',
              emergencyContactUpToDate: 'yes',
              nextOfKinUpToDate: 'yes',
              'travel-question': 'yes',
              'travel-address': 'yes',
              'travel-mileage': 'yes',
              'travel-vehicle': 'yes',
            },
            pages: [],
          },
          appointments: [],
          veteranData: {},
        },
      };
      store = mockStore(initState);
    });
    it('Loads test component with hook', () => {
      const screen = render(
        <Provider store={store}>
          <TestComponent />
        </Provider>,
      );
      expect(screen.getByText(/TestComponent/i)).to.exist;
    });
  });
});
