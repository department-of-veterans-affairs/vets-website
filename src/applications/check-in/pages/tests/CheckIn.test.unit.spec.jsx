import React from 'react';

import { Provider } from 'react-redux';
import { expect } from 'chai';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { render } from '@testing-library/react';

import configureStore from 'redux-mock-store';

import CheckIn from '../CheckIn';

describe('check-in', () => {
  describe('CheckIn component', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
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
    it('show appointment details progress', () => {
      const mockRouter = {
        params: {
          token: 'token-123',
        },
      };
      const checkIn = render(
        <Provider store={store}>
          <CheckIn router={mockRouter} />
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
      axeCheck(
        <Provider store={store}>
          <CheckIn router={mockRouter} />
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
        const checkIn = render(
          <Provider store={store}>
            <CheckIn router={mockRouter} isUpdatePageEnabled />
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
        const checkIn = render(
          <Provider store={store}>
            <CheckIn router={mockRouter} isUpdatePageEnabled={false} />
          </Provider>,
        );
        expect(checkIn.queryByTestId('back-button')).to.not.exist;
      });
    });
  });
});
