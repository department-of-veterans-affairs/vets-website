import React from 'react';
import { expect } from 'chai';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { render } from '@testing-library/react';

import DisplaySingleAppointment from '../DisplaySingleAppointment';

describe('check-in', () => {
  describe('DisplaySingleAppointment component', () => {
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
      const appointment = {
        clinicPhone: '555-867-5309',
        startTime: '2021-07-19T13:56:31',
        facilityName: 'Acme VA',
        clinicName: 'Green Team Clinic1',
      };

      const checkIn = render(
        <Provider store={store}>
          <DisplaySingleAppointment
            router={mockRouter}
            token={token}
            appointment={appointment}
          />
        </Provider>,
      );

      expect(checkIn.getByTestId('appointment-date')).to.exist;
      expect(checkIn.getByTestId('appointment-date')).to.have.text(
        'Monday, July 19, 2021',
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
      const appointment = {
        clinicPhone: '555-867-5309',
        startTime: '2021-07-19T13:56:31',
        facilityName: 'Acme VA',
        clinicName: 'Green Team Clinic1',
      };

      axeCheck(
        <Provider store={store}>
          <DisplaySingleAppointment
            router={mockRouter}
            appointment={appointment}
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
        const appointment = {
          clinicPhone: '555-867-5309',
          startTime: '2021-07-19T13:56:31',
          facilityName: 'Acme VA',
          clinicName: 'Green Team Clinic1',
        };

        const checkIn = render(
          <Provider store={store}>
            <DisplaySingleAppointment
              router={mockRouter}
              token={token}
              appointment={appointment}
              isUpdatePageEnabled
            />
          </Provider>,
        );
        expect(checkIn.getByTestId('back-button')).to.exist;
      });
      it('hides the back button if update page is enabled', () => {
        const mockRouter = {
          params: {
            token: 'token-123',
          },
        };

        const token = 'token-123';
        const appointment = {
          clinicPhone: '555-867-5309',
          startTime: '2021-07-19T13:56:31',
          facilityName: 'Acme VA',
          clinicName: 'Green Team Clinic1',
        };

        const checkIn = render(
          <Provider store={store}>
            <DisplaySingleAppointment
              router={mockRouter}
              token={token}
              appointment={appointment}
              isUpdatePageEnabled={false}
            />
          </Provider>,
        );
        expect(checkIn.queryByTestId('back-button')).to.not.exist;
      });
    });
  });
});
