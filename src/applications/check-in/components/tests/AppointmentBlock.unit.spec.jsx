import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import { format as formatDate } from 'date-fns';
import i18n from '../../utils/i18n/i18n';

import AppointmentBlock from '../AppointmentBlock';

const appointments = [
  {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: 'TEST CLINIC',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen: 'some-ien',
    startTime: '2021-11-16T21:39:36',
    doctorName: 'Dr. Green',
    clinicStopCodeName: 'Primary care',
    kind: 'clinic',
  },
  {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: '',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen: 'some-ien2',
    startTime: '2021-11-16T23:00:00',
    kind: 'clinic',
  },
];
describe('AppointmentBlock', () => {
  describe('pre-check-in context', () => {
    let mockRouter;
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: '',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
          },
          app: 'preCheckIn',
        },
      };
      store = mockStore(initState);

      mockRouter = {
        params: {
          token: 'token-123',
        },
        location: {
          pathname: '/third-page',
        },
      };
    });
    describe('In person appointment context', () => {
      it('Renders appointment day for multiple appointments', () => {
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <AppointmentBlock
                appointments={appointments}
                page="intro"
                router={mockRouter}
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(screen.getByTestId('appointment-day-location')).to.have.text(
          'Your appointments are on November 16, 2021.',
        );
        expect(screen.getAllByTestId('appointment-list-item').length).to.equal(
          2,
        );
      });
      it('Renders appointment day and facility for single appointment', () => {
        const updateAppointments = [...appointments];
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <AppointmentBlock
                appointments={[updateAppointments.shift()]}
                page="intro"
                router={mockRouter}
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(screen.getByTestId('appointment-day-location')).to.have.text(
          'Your appointment is on November 16, 2021.',
        );

        expect(screen.getAllByTestId('appointment-list-item').length).to.equal(
          1,
        );
      });
    });
    describe('Phone appointment context', () => {
      const phoneAppointments = JSON.parse(JSON.stringify(appointments));
      phoneAppointments[0].kind = 'phone';
      phoneAppointments[1].kind = 'phone';

      it('Renders appointment time with no clinic for phone appointments', () => {
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <AppointmentBlock
                appointments={phoneAppointments}
                page="confirmation"
                router={mockRouter}
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(screen.getByTestId('appointment-day-location')).to.have.text(
          'Your appointments are on November 16, 2021.',
        );
      });
    });
  });
  describe('day-of context', () => {
    let mockRouter;
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: '',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
          },
          app: 'dayOf',
        },
      };
      store = mockStore(initState);

      mockRouter = {
        params: {
          token: 'token-123',
        },
        location: {
          pathname: '/third-page',
        },
      };
    });
    describe('In person appointment context', () => {
      it('Renders appointment date', () => {
        const today = formatDate(new Date(), 'MMMM dd, yyyy');
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <AppointmentBlock
                appointments={appointments}
                page="details"
                router={mockRouter}
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(screen.getByTestId('date-text')).to.have.text(
          `Here are your appointments for today: ${today}.`,
        );
      });
    });
  });
});
