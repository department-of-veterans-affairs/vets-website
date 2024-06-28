/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import format from 'date-fns/format';
import { render } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import AppointmentsPage from './index';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import * as useGetCheckInDataModule from '../../../hooks/useGetCheckInData';

describe('unified check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('AppointmentsPage', () => {
    const appointmentsOn = {
      check_in_experience_upcoming_appointments_enabled: true,
    };
    const appointmentsOff = {
      check_in_experience_upcoming_appointments_enabled: false,
    };
    it('renders regions', () => {
      // Mock the return value for the useGetCheckInData hook
      const useGetCheckInDataStub = sinon
        .stub(useGetCheckInDataModule, 'useGetCheckInData')
        .returns({
          isComplete: true,
        });

      const { getByTestId } = render(
        <CheckInProvider store={{ features: appointmentsOn }}>
          <AppointmentsPage />
        </CheckInProvider>,
      );

      expect(getByTestId('what-to-do-next')).to.exist;
      expect(getByTestId('upcoming-appointments-vaos')).to.exist;
      expect(getByTestId('appointments-accordions')).to.exist;

      // Restore the hook
      useGetCheckInDataStub.restore();
    });
    it('displays a loading component if data is loading', () => {
      // Mock the return value for the useGetCheckInData hook
      const useGetCheckInDataStub = sinon
        .stub(useGetCheckInDataModule, 'useGetCheckInData')
        .returns({
          isComplete: false,
          isLoading: true,
        });
      const screen = render(
        <CheckInProvider store={{ appointments: [], features: appointmentsOn }}>
          <AppointmentsPage />
        </CheckInProvider>,
      );

      expect(screen.getByTestId('loading-indicator')).to.exist;
      // restore the hook
      useGetCheckInDataStub.restore();
    });
    it('shows the date & time the appointments were loaded & a refresh link', () => {
      const checkIn = render(
        <CheckInProvider store={{ features: appointmentsOn }}>
          <AppointmentsPage />
        </CheckInProvider>,
      );
      expect(checkIn.getByTestId('update-text')).to.have.text(
        `Latest update: ${format(new Date(), "MMMM d, yyyy 'at' h:mm aaaa")}`,
      );
      const refreshButton = checkIn.queryByTestId(
        'refresh-appointments-button',
      );
      expect(refreshButton).to.exist;
    });
    it('displays upcoming vista appointments with the feature off', () => {
      const checkIn = render(
        <CheckInProvider store={{ features: appointmentsOff }}>
          <AppointmentsPage />
        </CheckInProvider>,
      );
      expect(checkIn.queryByTestId('upcoming-appointments-vista')).to.exist;
    });
    it('shows a privacy act modal if the link is clicked', () => {
      const checkIn = render(
        <CheckInProvider store={{ features: appointmentsOn }}>
          <AppointmentsPage />
        </CheckInProvider>,
      );
      const privacyActLink = checkIn.getByTestId('privacy-act-statement-link');
      expect(privacyActLink).to.exist;
      privacyActLink.click();
      expect(checkIn.getByTestId('privacy-act-statement-text')).to.exist;
    });
  });
});
