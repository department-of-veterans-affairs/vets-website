import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import AppointmentAction from '../AppointmentAction';

import { STATUSES } from '../../../utils/appointment/status';

describe('check-in', () => {
  describe('AppointmentAction', () => {
    it('should render the bad status message for appointments with INELIGIBLE_BAD_STATUS status', () => {
      const action = render(<AppointmentAction appointment={{}} />);

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('no-status-given-message')).to.exist;
      expect(action.getByTestId('no-status-given-message')).to.have.text(
        'This appointment isn’t eligible for online check-in. Check-in with a staff member.',
      );
    });
    it('should render the check in button for ELIGIBLE appointments status', () => {
      const action = render(
        <AppointmentAction
          appointment={{
            status: STATUSES.ELIGIBLE,
          }}
        />,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      expect(action.getByTestId('check-in-button')).to.have.text(
        'Check in now',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_BAD_STATUS status', () => {
      const action = render(
        <AppointmentAction
          appointment={{
            status: STATUSES.INELIGIBLE_BAD_STATUS,
          }}
        />,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('ineligible-bad-status-message')).to.exist;
      expect(action.getByTestId('ineligible-bad-status-message')).to.have.text(
        'This appointment isn’t eligible for online check-in. Check-in with a staff member.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_UNSUPPORTED_LOCATION status', () => {
      const action = render(
        <AppointmentAction
          appointment={{
            status: STATUSES.INELIGIBLE_UNSUPPORTED_LOCATION,
          }}
        />,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('unsupported-location-message')).to.exist;
      expect(action.getByTestId('unsupported-location-message')).to.have.text(
        'This appointment isn’t eligible for online check-in. Check-in with a staff member.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_UNKNOWN_REASON status', () => {
      const action = render(
        <AppointmentAction
          appointment={{
            status: STATUSES.INELIGIBLE_UNKNOWN_REASON,
          }}
        />,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('unknown-reason-message')).to.exist;
      expect(action.getByTestId('unknown-reason-message')).to.have.text(
        'This appointment isn’t eligible for online check-in. Check-in with a staff member.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_TOO_LATE status', () => {
      const action = render(
        <AppointmentAction
          appointment={{
            status: STATUSES.INELIGIBLE_TOO_LATE,
          }}
        />,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('too-late-message')).to.exist;
      expect(action.getByTestId('too-late-message')).to.have.text(
        "Your appointment started more than 10 minutes ago. We can't check you in online. Ask a staff member for help.",
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_TOO_EARLY status', () => {
      const action = render(
        <AppointmentAction
          appointment={{
            status: STATUSES.INELIGIBLE_TOO_EARLY,
            startTime: '2021-07-19T14:00:00',
          }}
        />,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('too-early-message')).to.exist;
      expect(action.getByTestId('too-early-message')).to.have.text(
        'You can check in starting at this time: 2:00 p.m.',
      );
    });

    it('check in button passes axeCheck', () => {
      axeCheck(
        <AppointmentAction
          appointment={{
            status: STATUSES.ELIGIBLE,
          }}
        />,
      );
    });
  });
});
