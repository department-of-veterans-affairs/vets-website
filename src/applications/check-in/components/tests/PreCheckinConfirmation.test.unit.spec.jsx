import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import {
  singleAppointment,
  multipleAppointments,
} from '../../tests/unit/mocks/mock-appointments';

import PreCheckinConfirmation from '../PreCheckinConfirmation';

describe('pre-check-in', () => {
  const formData = {
    demographicsUpToDate: 'yes',
    emergencyContactUpToDate: 'yes',
    nextOfKinUpToDate: 'yes',
  };
  const mockstore = {
    app: 'preCheckIn',
  };
  const featureStore = {
    app: 'preCheckIn',
    features: {
      // eslint-disable-next-line camelcase
      check_in_experience_45_minute_reminder: true,
    },
  };

  const mockRouter = {
    currentPage: '/health-care/appointment-pre-check-in',
  };

  describe('Confirmation page', () => {
    describe('appointment without friendly name', () => {
      const appointments = singleAppointment;
      appointments[0].clinicFriendlyName = '';
      it('renders loading screen', () => {
        const wrapper = render(
          <CheckInProvider store={mockstore} router={mockRouter}>
            <PreCheckinConfirmation
              appointments={appointments}
              formData={formData}
              isLoading
              router={mockRouter}
            />
          </CheckInProvider>,
        );
        expect(wrapper.queryByTestId('loading-indicator')).to.exist;
        wrapper.unmount();
      });
    });
    describe('appointments with friendly name', () => {
      const appointments = multipleAppointments;
      it('renders page - no updates', () => {
        const screen = render(
          <CheckInProvider store={mockstore} router={mockRouter}>
            <PreCheckinConfirmation
              appointments={appointments}
              formData={formData}
              isLoading={false}
              router={mockRouter}
            />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('confirmation-wrapper')).to.exist;
        screen.getAllByTestId('in-person-msg-confirmation').forEach(message => {
          expect(message).to.have.text(
            'Please bring your insurance cards with you to your appointment.',
          );
        });
      });

      it('renders page with new help text', () => {
        const screen = render(
          <CheckInProvider store={featureStore} router={mockRouter}>
            <PreCheckinConfirmation
              appointments={appointments}
              formData={formData}
              isLoading={false}
              router={mockRouter}
            />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('confirmation-wrapper')).to.exist;
        screen.getAllByTestId('in-person-msg-confirmation').forEach(message => {
          expect(message).to.have.text(
            'Remember to bring your insurance cards with you. On the day of the appointment, we’ll send you a text when it’s time to check in.',
          );
        });
      });
    });
  });
});
