import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import AppointmentListItem from '../AppointmentListItem';

describe('check-in', () => {
  describe('AppointmentListItem', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {},
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
          },
        },
      };
      store = mockStore(initState);
    });
    it('should render the appointment time', () => {
      const listItem = render(
        <Provider store={store}>
          <AppointmentListItem
            appointment={{
              startTime: '2021-07-19T13:56:31',
              clinicFriendlyName: 'Green Team Clinic1',
              facility: 'Green Team facility',
            }}
          />
        </Provider>,
      );

      expect(listItem.getByTestId('appointment-time')).to.exist;
      expect(listItem.getByTestId('appointment-time').innerHTML).to.match(
        /([\d]|[\d][\d]):[\d][\d]/,
      );
      expect(listItem.getByTestId('clinic-name')).to.exist;
      expect(listItem.getByTestId('clinic-name')).to.have.text(
        'Green Team Clinic1',
      );
      expect(listItem.getByTestId('facility-name')).to.exist;
      expect(listItem.getByTestId('facility-name')).to.have.text(
        'Green Team facility',
      );
    });
    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <AppointmentListItem
            appointment={{
              startTime: '2021-07-19T13:56:31',
              clinicFriendlyName: 'Green Team Clinic1',
              facility: 'Green Team facility',
            }}
          />
        </Provider>,
      );
    });
  });
});
