/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import AppointmentListInfoBlock from '../AppointmentListInfoBlock';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';

describe('unified check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('AppointmentListInfoBlock', () => {
    const appointmentsOn = {
      check_in_experience_upcoming_appointments_enabled: true,
    };
    it('displays the correct number of accordion items', () => {
      const checkIn = render(
        <CheckInProvider store={{ features: appointmentsOn }}>
          <AppointmentListInfoBlock />
        </CheckInProvider>,
      );
      expect(
        checkIn.getAllByTestId('appointments-accordion-item'),
      ).to.have.length(2);
    });
    it('shows a privacy act modal if the link is clicked', () => {
      const checkIn = render(
        <CheckInProvider store={{ features: appointmentsOn }}>
          <AppointmentListInfoBlock />
        </CheckInProvider>,
      );
      const privacyActLink = checkIn.getByTestId('privacy-act-statement-link');
      expect(privacyActLink).to.exist;
      privacyActLink.click();
      expect(checkIn.getByTestId('privacy-act-statement-text')).to.exist;
    });
  });
});
