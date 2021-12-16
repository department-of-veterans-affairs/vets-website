import React from 'react';
import { expect } from 'chai';
import format from 'date-fns/format';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { render } from '@testing-library/react';

import DisplayMultipleAppointments from '../DisplayMultipleAppointments';

describe('check-in', () => {
  describe('DisplayMultipleAppointments component', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {},
      };
      store = mockStore(initState);
    });
    it('show appointment details progress', () => {
      const mockRouter = {
        params: {
          token: 'token-123',
        },
      };

      const token = 'token-123';
      const appointments = [
        {
          clinicPhone: '555-867-5309',
          startTime: '2021-07-19T13:56:31',
          facilityName: 'Acme VA',
          clinicName: 'Green Team Clinic1',
        },
      ];

      const checkIn = render(
        <Provider store={store}>
          <DisplayMultipleAppointments
            router={mockRouter}
            token={token}
            appointments={appointments}
          />
        </Provider>,
      );

      expect(checkIn.getAllByRole('list')).to.exist;

      expect(checkIn.getByTestId('date-text')).to.exist;
      expect(checkIn.getByTestId('date-text')).to.have.text(
        `Here are your appointments for today: ${format(
          new Date(),
          'MMMM dd, yyyy',
        )}.`,
      );

      expect(checkIn.getByTestId('appointment-time')).to.exist;
      expect(checkIn.getByTestId('appointment-time').innerHTML).to.match(
        /([\d]|[\d][\d]):[\d][\d]/,
      );
      expect(checkIn.getByTestId('clinic-name')).to.exist;
      expect(checkIn.getByTestId('clinic-name')).to.have.text(
        'Green Team Clinic1',
      );
    });
    it('passes axeCheck', () => {
      const mockRouter = {
        params: {
          token: 'token-123',
        },
      };
      const appointments = [
        {
          clinicPhone: '555-867-5309',
          startTime: '2021-07-19T13:56:31',
          facilityName: 'Acme VA',
          clinicName: 'Green Team Clinic1',
        },
      ];

      axeCheck(
        <Provider store={store}>
          <DisplayMultipleAppointments
            router={mockRouter}
            appointments={appointments}
          />
        </Provider>,
      );
    });
    describe('back button visibility based on update page', () => {
      it('shows the back button if update page is enabled', () => {
        const mockRouter = {
          params: {
            token: 'token-123',
          },
        };

        const token = 'token-123';
        const appointments = [
          {
            clinicPhone: '555-867-5309',
            startTime: '2021-07-19T13:56:31',
            facilityName: 'Acme VA',
            clinicName: 'Green Team Clinic1',
          },
        ];

        const checkIn = render(
          <Provider store={store}>
            <DisplayMultipleAppointments
              router={mockRouter}
              token={token}
              appointments={appointments}
            />
          </Provider>,
        );
        expect(checkIn.getByTestId('back-button')).to.exist;
      });
      it('shows the back button if demographics page is enabled', () => {
        const mockRouter = {
          params: {
            token: 'token-123',
          },
        };

        const token = 'token-123';
        const appointments = [
          {
            clinicPhone: '555-867-5309',
            startTime: '2021-07-19T13:56:31',
            facilityName: 'Acme VA',
            clinicName: 'Green Team Clinic1',
          },
        ];

        const checkIn = render(
          <Provider store={store}>
            <DisplayMultipleAppointments
              router={mockRouter}
              token={token}
              appointments={appointments}
            />
          </Provider>,
        );
        expect(checkIn.getByTestId('back-button')).to.exist;
      });

      it('shows the date & time the appointments were loaded & a refresh link', () => {
        const mockRouter = {
          params: {
            token: 'token-123',
          },
        };

        const token = 'token-123';
        const appointments = [
          {
            clinicPhone: '555-867-5309',
            startTime: '2021-07-19T13:56:31',
            facilityName: 'Acme VA',
            clinicName: 'Green Team Clinic1',
          },
        ];

        const checkIn = render(
          <Provider store={store}>
            <DisplayMultipleAppointments
              router={mockRouter}
              token={token}
              appointments={appointments}
              isUpdatePageEnabled
            />
          </Provider>,
        );
        expect(checkIn.getByTestId('update-text')).to.have.text(
          `Latest update: ${format(new Date(), "MMMM d, yyyy 'at' h:mm aaaa")}`,
        );
        expect(checkIn.queryByTestId('refresh-appointments-button')).to.exist;
      });
    });
  });
});
