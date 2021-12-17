import React from 'react';

import { Provider } from 'react-redux';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import configureStore from 'redux-mock-store';

import CheckIn from '../index';

describe('check-in', () => {
  describe('CheckIn component', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: 'some-token',
          },
          appointments: [
            {
              clinicPhone: '555-867-5309',
              startTime: '2021-07-19T13:56:31',
              facilityName: 'Acme VA',
              clinicName: 'Green Team Clinic1',
            },
          ],
        },
      };
      store = mockStore(initState);
    });
    it('passes axeCheck', () => {
      const mockRouter = {
        params: {
          token: 'token-123',
        },
      };
      axeCheck(
        <Provider store={store}>
          <CheckIn
            router={mockRouter}
            appointments={[
              {
                clinicPhone: '555-867-5309',
                startTime: '2021-07-19T13:56:31',
                facilityName: 'Acme VA',
                clinicName: 'Green Team Clinic1',
              },
            ]}
          />
        </Provider>,
      );
    });
    it('shows the loading indicator', () => {
      const mockRouter = {
        params: {
          token: 'token-123',
        },
      };

      const { container } = render(
        <Provider store={store}>
          <CheckIn isLoading router={mockRouter} />
        </Provider>,
      );

      expect(container.querySelector('va-loading-indicator')).to.have.attribute(
        'message',
        'Loading your appointments for today',
      );
    });
    it('refreshes appointments', () => {
      const mockRouter = {
        params: {
          token: 'token-123',
        },
      };

      const screen = render(
        <Provider store={store}>
          <CheckIn
            appointments={[
              {
                clinicPhone: '555-867-5309',
                startTime: '2021-07-19T13:56:31',
                facilityName: 'Acme VA',
                clinicName: 'Green Team Clinic1',
              },
            ]}
            router={mockRouter}
          />
        </Provider>,
      );

      expect(screen.queryByTestId('refresh-appointments-button')).to.exist;
      screen.queryByTestId('refresh-appointments-button').click();
    });
  });
});
