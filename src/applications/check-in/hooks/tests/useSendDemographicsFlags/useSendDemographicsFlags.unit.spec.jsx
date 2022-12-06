import React from 'react';

import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import configureStore from 'redux-mock-store';
import TestComponent from './TestComponent';

describe('check-in', () => {
  describe('useSendDemographicsFlags hook', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: 'some-token',
          },
          form: {
            data: {
              demographicsUpToDate: 'yes',
              emergencyContactUpToDate: 'yes',
              nextOfKinUpToDate: 'yes',
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
