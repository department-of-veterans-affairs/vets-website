import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import {
  ConfirmationGoBackLink,
  ConfirmationPrintThisPage,
  ConfirmationSubmissionAlert,
  ConfirmationWhatsNextProcessList,
  validateWithin180Days,
} from '../helpers';

describe('10297 Helpers', () => {
  describe('<ConfirmationSubmissionAlert />', () => {
    it('should render the submission alert inner message', () => {
      const { container } = render(<ConfirmationSubmissionAlert />);

      expect(container.querySelector('p').innerHTML).to.contain(
        'We’ve received your application. We’ll review it and email you a decision soon.',
      );
    });
  });

  describe('<ConfirmationPrintThisPage />', () => {
    it('should handle rendering summary box when no details are provided', () => {
      const data = { fullName: {} };
      const submission = {};
      const { getByTestId } = render(
        <ConfirmationPrintThisPage data={data} submission={submission} />,
      );

      expect(getByTestId('full-name').innerHTML).to.contain('---');
      expect(getByTestId('data-submitted').innerHTML).to.contain('---');
    });

    it('should render summary box with provided details', () => {
      const data = { fullName: { first: 'John', middle: 'Test', last: 'Doe' } };
      const submitDate = new Date('07/11/2025');
      const { getByTestId } = render(
        <ConfirmationPrintThisPage data={data} submitDate={submitDate} />,
      );

      expect(getByTestId('full-name').innerHTML).to.contain('John Test Doe');
      expect(getByTestId('data-submitted').innerHTML).to.contain(
        'Jul 11, 2025',
      );
    });
  });

  describe('<ConfirmationWhatsNextProcessList />', () => {
    it('shows process list section', () => {
      const { container } = render(<ConfirmationWhatsNextProcessList />);

      expect(container.querySelector('va-process-list')).to.exist;
      expect(
        container.querySelectorAll('va-process-list-item').length,
      ).to.equal(3);
    });
  });

  describe('<ConfirmationGoBackLink />', () => {
    it('should render an action link to go back to the VA.gov homepage', () => {
      const { container } = render(<ConfirmationGoBackLink />);

      expect(container.querySelector('va-link-action')).to.have.attribute(
        'text',
        'Go back to VA.gov',
      );
    });
  });

  const fmt = d =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`;

  const MS_IN_DAY = 86_400_000;
  const addDays = (base, days) => new Date(base.getTime() + days * MS_IN_DAY);

  describe('validateWithin180Days()', () => {
    // freeze “today” so tests are deterministic
    const TODAY = new Date('2025-01-01T12:00:00Z');
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers({
        now: TODAY.getTime(),
        toFake: ['Date'],
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it('does nothing (passes) when given today’s date', () => {
      const errors = { addError: sinon.spy() };
      validateWithin180Days(errors, fmt(TODAY));
      expect(errors.addError.called).to.be.false;
    });

    it('adds an error when given a past date', () => {
      const errors = { addError: sinon.spy() };
      validateWithin180Days(errors, fmt(addDays(TODAY, -1)));
      expect(errors.addError.calledOnce).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.match(/past/i);
    });

    it('adds an error when given a date more than 180 days in the future', () => {
      const errors = { addError: sinon.spy() };
      validateWithin180Days(errors, fmt(addDays(TODAY, 181)));
      expect(errors.addError.calledOnce).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.match(/180 days away/i);
    });

    it('does nothing (passes) for a date exactly 180 days in the future', () => {
      const errors = { addError: sinon.spy() };
      validateWithin180Days(errors, fmt(addDays(TODAY, 180)));
      expect(errors.addError.called).to.be.false;
    });

    it('does nothing when no date string is provided', () => {
      const errors = { addError: sinon.spy() };
      validateWithin180Days(errors, undefined);
      expect(errors.addError.called).to.be.false;
    });
  });
});
