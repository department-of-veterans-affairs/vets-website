import React from 'react';
import TestRenderer from 'react-test-renderer';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { I18nextProvider } from 'react-i18next';
import { axeCheck } from '@department-of-veterans-affairs/platform-forms-systems/test/config/helpers';
import i18n from '../../../../utils/i18n/i18n';
import Confirmation from '../index';
import {
  multipleAppointments,
  singleAppointment,
} from '../../../../tests/unit/mocks/mock-appointments';
import { scheduledDowntimeState } from '../../../../tests/unit/utils/initState';
import PreCheckinConfirmation from '../../../../components/PreCheckinConfirmation';

describe('pre-check-in', () => {
  describe('Confirmation page', () => {
    describe('redux store without friendly name', () => {
      const initState = {
        checkInData: {
          appointments: singleAppointment,
          veteranData: { demographics: {} },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            data: {
              demographicsUpToDate: 'yes',
              nextOfKinUpToDate: 'yes',
              emergencyContactUpToDate: 'yes',
            },
          },
          context: {
            token: 'token',
          },
        },
        ...scheduledDowntimeState,
      };
      initState.checkInData.appointments[0].clinicFriendlyName = '';
      const middleware = [];
      const mockStore = configureStore(middleware);
      const store = mockStore(initState);

      it('passes the correct props to the pre-checkin confirmation component', () => {
        const testRenderer = TestRenderer.create(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Confirmation />
            </I18nextProvider>
          </Provider>,
        );
        const testInstance = testRenderer.root;
        expect(
          testInstance.findByType(PreCheckinConfirmation).props.formData,
        ).to.equal(initState.checkInData.form.data);
        expect(
          testInstance.findByType(PreCheckinConfirmation).props.appointments,
        ).to.equal(initState.checkInData.appointments);
      });
    });
    describe('redux store with friendly name', () => {
      let initState;
      let store;
      beforeEach(() => {
        initState = {
          checkInData: {
            appointments: multipleAppointments,
            veteranData: { demographics: {} },
            form: {
              pages: [],
              data: {
                demographicsUpToDate: 'yes',
                nextOfKinUpToDate: 'yes',
                emergencyContactUpToDate: 'no',
              },
            },
            context: {
              token: 'token',
            },
          },
          ...scheduledDowntimeState,
        };
        const middleware = [];
        const mockStore = configureStore(middleware);
        store = mockStore(initState);
      });
      it('page passes axeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Confirmation />
            </I18nextProvider>
          </Provider>,
        );
      });
    });
  });
});
