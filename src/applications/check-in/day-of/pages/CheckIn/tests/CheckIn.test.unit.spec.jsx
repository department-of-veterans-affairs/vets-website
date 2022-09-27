import React from 'react';

import { Provider } from 'react-redux';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../../utils/i18n/i18n';
import { scheduledDowntimeState } from '../../../../tests/unit/utils/initState';
import CheckIn from '../index';

describe('check-in', () => {
  describe('CheckIn component', () => {
    let store;
    const mockRouter = {
      params: {
        token: 'token-123',
      },
      location: {
        pathname: '/third-page',
      },
    };
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: 'some-token',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            data: {
              demographicsUpToDate: 'yes',
              emergencyContactUpToDate: 'yes',
              nextOfKinUpToDate: 'yes',
            },
          },
          appointments: [
            {
              clinicPhone: '555-867-5309',
              startTime: '2021-07-19T13:56:31',
              facilityName: 'Acme VA',
              clinicName: 'Green Team Clinic1',
            },
          ],
          veteranData: {},
        },
        ...scheduledDowntimeState,
      };
      store = mockStore(initState);
    });
    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
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
          </I18nextProvider>
        </Provider>,
      );
    });

    it('refresh appointments button exists', () => {
      const screen = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
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
          </I18nextProvider>
        </Provider>,
      );

      expect(screen.queryByTestId('refresh-appointments-button')).to.exist;
    });
  });
});
