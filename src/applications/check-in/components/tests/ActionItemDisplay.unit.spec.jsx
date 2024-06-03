import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import { singleAppointment } from '../../tests/unit/mocks/mock-appointments';
import ActionItemDisplay from '../ActionItemDisplay';
import * as appointmentModule from '../../utils/appointment';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';

describe('unified check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('ActionItemDisplay', () => {
    it('displays the what to do next component if the app is day of', () => {
      const mockstore = {
        appointments: singleAppointment,
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
        appointments: singleAppointment,
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
    it('displays the WhatToDoNext component if the app is pre-check-in', () => {
      const mockstore = {
        appointments: singleAppointment,
        app: 'preCheckIn',
      };
      const { getByTestId } = render(
        <CheckInProvider store={mockstore}>
          <ActionItemDisplay />
        </CheckInProvider>,
      );

      expect(getByTestId('what-to-do-next')).to.exist;
    });
  });
});
