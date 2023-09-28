import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import {
  singleAppointment,
  multipleAppointments,
} from '../../tests/unit/mocks/mock-appointments';
import { makeSelectFeatureToggles } from '../../utils/selectors/feature-toggles';

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
  const mockRouter = {
    currentPage: '/health-care/appointment-pre-check-in',
  };

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { is45MinuteReminderEnabled } = featureToggles;

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
          if (is45MinuteReminderEnabled) {
            expect(message).to.have.text(
              'Remember to bring your insurance cards with you. On the day of the appointment, we’ll send you a text when it’s time to check in.',
            );
          } else {
            expect(message).to.have.text(
              'Please bring your insurance cards with you to your appointment.',
            );
          }
        });
      });
    });
  });
});
