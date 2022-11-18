import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import { add, sub } from 'date-fns';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import { within } from '@testing-library/dom';
import MockDate from 'mockdate';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { scheduledDowntimeState } from '../../../../tests/unit/utils/initState';
import i18n from '../../../../utils/i18n/i18n';
import { singleAppointment } from '../../../../tests/unit/mocks/mock-appointments';
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
            appointments: singleAppointment,
            veteranData: {},
            form: {
              pages: [],
            },
          },
        };
        afterEach(() => {
          MockDate.reset();
        });
        store = mockStore({ ...initState, ...scheduledDowntimeState });
      });
      it('renders appointments date', () => {
        MockDate.set('2022-01-01T14:00:00.000-05:00');
        const component = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Error />
            </I18nextProvider>
          </Provider>,
        );
        expect(component.getByText('Sorry, we can’t complete pre-check-in')).to
          .exist;
        const dateMessage = component.getByTestId('date-message');
        expect(dateMessage).to.exist;
        expect(dateMessage).to.contain.text(
          'You can pre-check in online until 01/02/2022.',
        );
      });
    });
    describe('store with expired appointment (between midnight and 15 min after appt start time)', () => {
      let store;
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
              startTime: new Date(),
              eligibility: 'ELIGIBLE',
              facilityId: 'some-facility',
              checkInWindowStart: new Date(),
              checkInWindowEnd: add(new Date(), { minutes: 14.9 }),
              checkedInTime: '',
            },
          ],
          form: {
            pages: [],
          },
          veteranData: {},
        },
      };

      it('renders correct error message and how-to link when in person pre-checkin is expired', () => {
        store = mockStore({ ...initState, ...scheduledDowntimeState });
        const component = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Error />
            </I18nextProvider>
          </Provider>,
        );
        expect(
          component.getByText('Sorry, pre-check-in is no longer available'),
        ).to.exist;
        expect(component.queryByTestId('how-to-link')).to.exist;
        const expiredMessage = component.getByTestId('error-message');
        expect(expiredMessage).to.exist;
        expect(
          within(expiredMessage).getByText(
            'You can still check-in with your phone once you arrive at your appointment.',
          ),
        ).to.exist;
      });
      it('renders correct error message when phone pre-checkin is expired', () => {
        const phoneInitState = JSON.parse(JSON.stringify(initState));
        phoneInitState.checkInData.appointments[0].kind = 'phone';
        store = mockStore({ ...phoneInitState, ...scheduledDowntimeState });

        const component = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Error />
            </I18nextProvider>
          </Provider>,
        );
        expect(
          component.getByText('Sorry, pre-check-in is no longer available'),
        ).to.exist;
        const expiredMessage = component.getByTestId('error-message');
        expect(component.queryByTestId('how-to-link')).to.not.exist;
        expect(expiredMessage).to.exist;
        expect(
          within(expiredMessage).getByText(
            'Your provider will call you at your appointment time. You may need to wait about 15 minutes for their call. Thanks for your patience.',
          ),
        ).to.exist;
      });
    });

    describe('store with canceled appointment', () => {
      let store;
      const middleware = [];
      const mockStore = configureStore(middleware);
      let initState = {};
      beforeEach(() => {
        initState = {
          checkInData: {
            appointments: [
              {
                facility: 'LOMA LINDA VA CLINIC',
                clinicPhoneNumber: '5551234567',
                clinicFriendlyName: 'TEST CLINIC',
                clinicName: 'LOM ACC CLINIC TEST',
                appointmentIen: 'some-ien',
                startTime: '2022-01-03T14:56:04.788',
                eligibility: 'ELIGIBLE',
                facilityId: 'some-facility',
                checkInWindowStart: '2022-01-03T14:56:04.788Z',
                checkInWindowEnd: '2022-01-03T14:56:04.788Z',
                checkedInTime: '',
                status: 'CANCELLED BY CLINIC',
              },
            ],
            form: {
              pages: [],
            },
            veteranData: {},
          },
        };
        store = mockStore({ ...initState, ...scheduledDowntimeState });
      });
      it('renders correct error message and no how-to link for an in-person cancelled appointment', () => {
        const component = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Error />
            </I18nextProvider>
          </Provider>,
        );
        expect(
          component.getByText('Sorry, pre-check-in is no longer available'),
        ).to.exist;
        expect(component.queryByTestId('how-to-link')).to.not.exist;
        const canceledMessage = component.getByTestId('error-message');
        expect(canceledMessage).to.exist;
        expect(
          within(canceledMessage).getByText(
            'Your appointment at 2:56 p.m. on January 03, 2022 is cancelled.',
          ),
        ).to.exist;
        expect(
          within(canceledMessage).getByText(
            'Or talk to a staff member if you’re at a VA facility.',
          ),
        ).to.exist;
      });
      it('renders correct error message for a canceled phone appointment', () => {
        const phoneInitState = JSON.parse(JSON.stringify(initState));
        phoneInitState.checkInData.appointments[0].kind = 'phone';
        store = mockStore({ ...phoneInitState, ...scheduledDowntimeState });
        const component = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Error />
            </I18nextProvider>
          </Provider>,
        );
        expect(
          component.getByText('Sorry, pre-check-in is no longer available'),
        ).to.exist;
        expect(component.queryByTestId('how-to-link')).to.not.exist;
        const canceledMessage = component.getByTestId('error-message');
        expect(canceledMessage).to.exist;
        expect(
          within(canceledMessage).getByText(
            'Your appointment at 2:56 p.m. on January 03, 2022 is cancelled.',
          ),
        ).to.exist;
        expect(
          within(canceledMessage).queryByText(
            'Or talk to a staff member if you’re at a VA facility.',
          ),
        ).not.to.exist;
      });
    });

    describe('store with appointment more than 15 minutes past its start time', () => {
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
                startTime: sub(new Date(), { minutes: 16 }),
                eligibility: 'INELIGIBLE_TOO_LATE',
                facilityId: 'some-facility',
                checkInWindowStart: sub(new Date(), { minutes: 16 }),
                checkInWindowEnd: sub(new Date(), { minutes: 16 }),
                checkedInTime: '',
              },
            ],
            form: {
              pages: [],
            },
            veteranData: {},
          },
        };
        store = mockStore({ ...initState, ...scheduledDowntimeState });
      });
      it('renders no sub message or how to link when appointment started more than 15 minutes ago', () => {
        const component = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Error />
            </I18nextProvider>
          </Provider>,
        );
        expect(component.queryByTestId('error-message')).to.be.null;
        expect(component.queryByTestId('how-to-link')).to.not.exist;
      });
    });
    describe('empty redux store', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            appointments: [],
            veteranData: {},
            form: {
              pages: [],
            },
          },
        };
        store = mockStore({ ...initState, ...scheduledDowntimeState });
      });
      it('renders error page', () => {
        const component = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Error />
            </I18nextProvider>
          </Provider>,
        );
        expect(component.getByText('Sorry, we can’t complete pre-check-in')).to
          .exist;
        expect(component.getByTestId('error-message')).to.exist;
      });
      it('Passes AxeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Error />
            </I18nextProvider>
          </Provider>,
        );
      });
    });
  });
});
