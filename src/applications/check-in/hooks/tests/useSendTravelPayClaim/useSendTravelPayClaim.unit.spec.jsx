import React from 'react';

import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import configureStore from 'redux-mock-store';
import TestComponent from './TestComponent';
import { api } from '../../../api';

describe('check-in', () => {
  describe('useSendTravelPayClaim hook', () => {
    const sandbox = sinon.createSandbox();
    const { v2 } = api;
    let store;
    beforeEach(() => {
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
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
          },
          form: {
            data: {
              demographicsUpToDate: 'yes',
              emergencyContactUpToDate: 'yes',
              nextOfKinUpToDate: 'yes',
              'travel-question': 'yes',
              'travel-address': 'yes',
              'travel-mileage': 'yes',
              'travel-review': 'yes',
              'travel-vehicle': 'yes',
            },
            pages: [],
          },
          appointments: [
            {
              startTime: '2022-08-12T15:15:00',
            },
          ],
          veteranData: {},
        },
      };
      store = mockStore(initState);
      sandbox.stub(v2, 'postDayOfTravelPayClaim').resolves({});
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('Loads test component with hook', () => {
      const screen = render(
        <Provider store={store}>
          <TestComponent />
        </Provider>,
      );
      expect(screen.getByText(/TestComponent/i)).to.exist;
      sandbox.assert.calledOnce(v2.postDayOfTravelPayClaim);
    });
  });
});
