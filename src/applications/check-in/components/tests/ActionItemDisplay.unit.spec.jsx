import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import {
  multipleAppointments,
  singleAppointment,
} from '../../tests/unit/mocks/mock-appointments';
import ActionItemDisplay from '../ActionItemDisplay';
import * as appointmentModule from '../../utils/appointment';

describe('unified check-in experience', () => {
  describe('ActionItemDisplay', () => {
    it('displays the what to do next component if the app is day of', () => {
      const mockstore = {
        upcomingAppointments: multipleAppointments,
        app: 'dayOf',
      };
      const { getByTestId } = render(
        <CheckInProvider store={mockstore}>
          <ActionItemDisplay />
        </CheckInProvider>,
      );
      expect(getByTestId('what-to-do-next')).to.exist;
    });
    it('displays the WhatToDoNext component if the app is day-of and pre check in is complete', () => {
      const mockstore = {
        upcomingAppointments: singleAppointment,
        app: 'dayOf',
      };
      const preCheckinAlreadyCompletedStub = sinon
        .stub(appointmentModule, 'preCheckinAlreadyCompleted')
        .returns(true);
      const { getByTestId } = render(
        <CheckInProvider store={mockstore}>
          <ActionItemDisplay />
        </CheckInProvider>,
      );

      expect(getByTestId('what-to-do-next')).to.exist;

      preCheckinAlreadyCompletedStub.restore();
    });
    it('displays the pre-check-in-success-alert if the app is pre-check-in and pre check in is complete', () => {
      const mockstore = {
        upcomingAppointments: singleAppointment,
        app: 'preCheckIn',
      };
      const preCheckinAlreadyCompletedStub = sinon
        .stub(appointmentModule, 'preCheckinAlreadyCompleted')
        .returns(true);
      const { getByTestId } = render(
        <CheckInProvider store={mockstore}>
          <ActionItemDisplay />
        </CheckInProvider>,
      );

      expect(getByTestId('pre-check-in-success-alert')).to.exist;

      preCheckinAlreadyCompletedStub.restore();
    });
    it('displays the correct success message for phone appointments', () => {
      const mockstore = {
        upcomingAppointments: singleAppointment,
        app: 'preCheckIn',
      };
      const preCheckinAlreadyCompletedStub = sinon
        .stub(appointmentModule, 'preCheckinAlreadyCompleted')
        .returns(true);
      const hasPhoneAppointmentsStub = sinon
        .stub(appointmentModule, 'hasPhoneAppointments')
        .returns(true);
      const { getByTestId } = render(
        <CheckInProvider store={mockstore}>
          <ActionItemDisplay />
        </CheckInProvider>,
      );

      expect(getByTestId('pre-check-in-success-alert')).to.exist;
      expect(getByTestId('success-message-phone')).to.exist;

      preCheckinAlreadyCompletedStub.restore();
      hasPhoneAppointmentsStub.restore();
    });
    it('displays the correct success message for in person appointments', () => {
      const mockstore = {
        upcomingAppointments: singleAppointment,
        app: 'preCheckIn',
      };
      const preCheckinAlreadyCompletedStub = sinon
        .stub(appointmentModule, 'preCheckinAlreadyCompleted')
        .returns(true);
      const { getByTestId } = render(
        <CheckInProvider store={mockstore}>
          <ActionItemDisplay />
        </CheckInProvider>,
      );

      expect(getByTestId('pre-check-in-success-alert')).to.exist;
      expect(getByTestId('success-message-in-person')).to.exist;
      preCheckinAlreadyCompletedStub.restore();
    });
  });
});
