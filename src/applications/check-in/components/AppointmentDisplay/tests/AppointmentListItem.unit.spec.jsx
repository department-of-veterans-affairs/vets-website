import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';

import AppointmentListItem from '../AppointmentListItem';
import i18n from '../../../utils/i18n/i18n';

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
          <I18nextProvider i18n={i18n}>
            <AppointmentListItem
              appointment={{
                startTime: '2021-07-19T13:56:31',
                clinicFriendlyName: 'Green Team Clinic1',
                facility: 'Green Team facility',
              }}
            />
          </I18nextProvider>
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
    it('should render the appointment location for in-person appointments when available', () => {
      const listItem = render(
        <Provider store={store}>
          <AppointmentListItem
            appointment={{
              startTime: '2021-07-19T13:56:31',
              clinicFriendlyName: 'Green Team Clinic1',
              facility: 'Green Team facility',
              clinicLocation: 'Green Team location',
              kind: 'clinic',
            }}
          />
        </Provider>,
      );

      expect(listItem.getByTestId('clinic-location')).to.exist;
      expect(listItem.getByTestId('clinic-location')).to.have.text(
        'Green Team location',
      );
    });
    it('should not render the appointment location for phone appointments even if available', () => {
      const listItem = render(
        <Provider store={store}>
          <AppointmentListItem
            appointment={{
              startTime: '2021-07-19T13:56:31',
              clinicFriendlyName: 'Green Team Clinic1',
              facility: 'Green Team facility',
              clinicLocation: 'Green Team location',
              kind: 'phone',
            }}
          />
        </Provider>,
      );

      expect(listItem.queryByTestId('clinic-location')).to.not.exist;
    });
    it('should not render the appointment location when not available', () => {
      const listItem = render(
        <Provider store={store}>
          <AppointmentListItem
            appointment={{
              startTime: '2021-07-19T13:56:31',
              clinicFriendlyName: 'Green Team Clinic1',
              facility: 'Green Team facility',
              kind: 'clinic',
            }}
          />
        </Provider>,
      );

      expect(listItem.queryByTestId('clinic-location')).to.not.exist;
    });
    it('should default type of care to VA Appointment when value not available', () => {
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

      expect(listItem.getByTestId('type-of-care')).to.exist;
      expect(listItem.getByTestId('type-of-care')).to.have.text(
        'VA Appointment',
      );
    });
    it('should render type of care when available', () => {
      const listItem = render(
        <Provider store={store}>
          <AppointmentListItem
            appointment={{
              startTime: '2021-07-19T13:56:31',
              clinicFriendlyName: 'Green Team Clinic1',
              facility: 'Green Team facility',
              clinicStopCodeName: 'Green Team care',
            }}
          />
        </Provider>,
      );

      expect(listItem.getByTestId('type-of-care')).to.exist;
      expect(listItem.getByTestId('type-of-care')).to.have.text(
        'Green Team care',
      );
    });

    it('should render the provider when available', () => {
      const listItem = render(
        <Provider store={store}>
          <AppointmentListItem
            appointment={{
              startTime: '2021-07-19T13:56:31',
              clinicFriendlyName: 'Green Team Clinic1',
              facility: 'Green Team facility',
              doctorName: 'Dr. Green',
            }}
          />
        </Provider>,
      );

      expect(listItem.getByTestId('provider')).to.exist;
      expect(listItem.getByTestId('provider')).to.have.text('Dr. Green');
    });
    it('should not render the provider when not available', () => {
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

      expect(listItem.queryByTestId('provider')).to.not.exist;
    });
  });
});
