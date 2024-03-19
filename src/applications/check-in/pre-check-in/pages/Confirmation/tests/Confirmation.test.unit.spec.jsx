import React from 'react';
import TestRenderer from 'react-test-renderer';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { I18nextProvider } from 'react-i18next';
import { setupI18n, teardownI18n } from '../../../../utils/i18n/i18n';
import Confirmation from '../index';
import { singleAppointment } from '../../../../tests/unit/mocks/mock-appointments';
import { scheduledDowntimeState } from '../../../../tests/unit/utils/initState';
import PreCheckinConfirmation from '../../../../components/PreCheckinConfirmation';

describe('pre-check-in', () => {
  let i18n;
  beforeEach(() => {
    i18n = setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
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
      const mockRouter = {
        push: () => {},
        location: {
          basename: '/health-care/appointment-pre-check-in',
        },
      };

      it('passes the correct props to the pre-checkin confirmation component', () => {
        const testRenderer = TestRenderer.create(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Confirmation router={mockRouter} />
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
  });
});
