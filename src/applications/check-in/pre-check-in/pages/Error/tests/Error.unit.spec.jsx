import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Error from '../index';

describe('check-in', () => {
  describe('Pre-check-in Error page', () => {
    describe('redux store with appointments', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            appointments: [
              {
                facility: 'LOMA LINDA VA CLINIC',
                clinicPhoneNumber: '5551234567',
                clinicFriendlyName: 'TEST CLINIC',
                clinicName: 'LOM ACC CLINIC TEST',
                appointmentIen: 'some-ien',
                startTime: '2022-01-03T14:56:04.788Z',
                eligibility: 'ELIGIBLE',
                facilityId: 'some-facility',
                checkInWindowStart: '2022-01-03T14:56:04.788Z',
                checkInWindowEnd: '2022-01-03T14:56:04.788Z',
                checkedInTime: '',
              },
            ],
            veteranData: {},
          },
        };
        store = mockStore(initState);
      });
      it('renders appointments date', () => {
        const component = render(
          <Provider store={store}>
            <Error />
          </Provider>,
        );
        const dateMessage = component.getByTestId('date-message');
        expect(dateMessage).to.exist;
        expect(
          within(dateMessage).getByText(
            'You can pre-check in online until 01/02/2022.',
          ),
        ).to.exist;
      });
      it('renders correct error message when pre-checkin is expired', () => {
        const component = render(
          <Provider store={store}>
            <Error location={{ query: { type: 'expired' } }} />
          </Provider>,
        );
        const expiredMessage = component.getByTestId('error-message');
        expect(expiredMessage).to.exist;
        expect(
          within(expiredMessage).getByText(
            'You can still check-in with your phone once you arrive at your appointment.',
          ),
        ).to.exist;
      });
    });
    describe('empty redux store', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            appoinments: [],
            veteranData: {},
          },
        };
        store = mockStore(initState);
      });
      it('renders error page', () => {
        const component = render(
          <Provider store={store}>
            <Error />
          </Provider>,
        );
        expect(component.getByTestId('error-message')).to.exist;
      });
      it('correctly renders pre-check-in expiration date', () => {
        const component = render(
          <Provider store={store}>
            <Error />
          </Provider>,
        );
        expect(component.getByTestId('error-message')).to.exist;
      });

      it('Passes AxeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <Error />
          </Provider>,
        );
      });
    });
  });
});
