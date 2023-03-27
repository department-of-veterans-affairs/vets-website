import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../utils/i18n/i18n';
import { scheduledDowntimeState } from '../../tests/unit/utils/initState';
import {
  singleAppointment,
  multipleAppointments,
} from '../../tests/unit/mocks/mock-appointments';

import PreCheckinConfirmation from '../PreCheckinConfirmation';

describe('pre-check-in', () => {
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
      ...scheduledDowntimeState,
    };
    store = mockStore(initState);
  });

  const formData = {
    demographicsUpToDate: 'yes',
    emergencyContactUpToDate: 'yes',
    nextOfKinUpToDate: 'yes',
  };

  const mockRouter = {
    push: ()=>{},
    location: {
      basename: '/health-care/appointment-pre-check-in',
    },
  };

  describe('Confirmation page', () => {
    describe('appointment without friendly name', () => {
      const appointments = singleAppointment;
      appointments[0].clinicFriendlyName = '';
      it('renders loading screen', () => {
        const wrapper = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <PreCheckinConfirmation
                appointments={appointments}
                formData={formData}
                isLoading
                router={mockRouter}
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(wrapper.queryByTestId('loading-indicator')).to.exist;
        wrapper.unmount();
      });
    });
    describe('appointments with friendly name', () => {
      const appointments = multipleAppointments;
      it('renders page - no updates', () => {
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <PreCheckinConfirmation
                appointments={appointments}
                formData={formData}
                isLoading={false}
                router={mockRouter}
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(screen.getByTestId('confirmation-wrapper')).to.exist;
        screen.getAllByTestId('in-person-msg-confirmation').forEach(message => {
          expect(message).to.have.text(
            'Please bring your insurance cards with you to your appointment.',
          );
        });
      });
    });
  });
});
