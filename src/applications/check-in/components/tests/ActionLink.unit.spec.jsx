import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import ActionLink from '../ActionLink';

describe('unified check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('ActionLink', () => {
    it('display the correct label for preCheckIn', () => {
      const { getByTestId } = render(
        <CheckInProvider>
          <ActionLink
            app="preCheckIn"
            action={() => {}}
            startTime="2023-01-01T10:00:00"
          />
        </CheckInProvider>,
      );
      expect(getByTestId('action-link')).to.have.text(
        'Review your information now',
      );
    });
    it('display the correct label for dayOf', () => {
      const { getByTestId } = render(
        <CheckInProvider>
          <ActionLink
            app="dayOf"
            action={() => {}}
            startTime="2023-01-01T10:00:00"
          />
        </CheckInProvider>,
      );
      expect(getByTestId('action-link')).to.have.text('Check in now');
    });
    it('calls action method once when clicked', () => {
      const actionSpy = sinon.spy();
      const { getByTestId } = render(
        <CheckInProvider>
          <ActionLink
            app="dayOf"
            action={actionSpy}
            startTime="2023-01-01T10:00:00"
          />
        </CheckInProvider>,
      );
      const actionLink = getByTestId('action-link');
      fireEvent.click(actionLink);
      expect(actionSpy.calledOnce).to.be.true;
    });
    it('has the correct aria-label for day of', () => {
      const { getByTestId } = render(
        <CheckInProvider>
          <ActionLink
            app="dayOf"
            action={() => {}}
            startTime="2023-01-01T10:00:00"
          />
        </CheckInProvider>,
      );
      expect(getByTestId('action-link')).to.have.attr(
        'aria-label',
        'Check in now for appointment on Sunday, January 1 at 10:00 a.m.',
      );
    });
  });
});
