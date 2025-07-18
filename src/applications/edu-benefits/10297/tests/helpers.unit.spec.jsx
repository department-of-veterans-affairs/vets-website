import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import {
  ConfirmationGoBackLink,
  ConfirmationPrintThisPage,
  ConfirmationSubmissionAlert,
  ConfirmationWhatsNextProcessList,
  getAgeInYears,
  getEligibilityStatus,
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
      const data = {
        fullName: {
          first: 'John',
          middle: 'Test',
          last: 'Doe',
        },
      };
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

  describe('#getAgeInYears', () => {
    let clock;

    beforeEach(() => {
      // Mock Date.now() to always return a fixed value in 2024
      const fixedTimestamp = new Date('2024-12-31T00:00:00Z').getTime();
      clock = sinon.useFakeTimers({ now: fixedTimestamp, toFake: ['Date'] });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should return the age in years based on the given birthDate', () => {
      expect(getAgeInYears('1963-01-01')).to.equal(61);
      expect(getAgeInYears('1962-12-31')).to.equal(62);
    });
  });

  describe('#getEligibilityStatus', () => {
    let clock;

    beforeEach(() => {
      // Mock Date.now() to always return a fixed value in 2024
      const fixedTimestamp = new Date('2024-12-31T00:00:00Z').getTime();
      clock = sinon.useFakeTimers({ now: fixedTimestamp, toFake: ['Date'] });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should handle when the formData is empty', () => {
      expect(getEligibilityStatus(undefined)).to.deep.equal({
        isDutyEligible: false,
        isDobEligible: false,
        isDischargeEligible: false,
        isFullyEligible: false,
      });
    });

    it('should handle when the formData fields fail requirements', () => {
      const formData = {
        dutyRequirement: 'none',
        dateOfBirth: '1950-07-01',
        otherThanDishonorableDischarge: false,
      };

      expect(getEligibilityStatus(formData)).to.deep.equal({
        isDutyEligible: false,
        isDobEligible: false,
        isDischargeEligible: false,
        isFullyEligible: false,
      });
    });

    it('should handle when the formData fields pass requirements', () => {
      const formData = {
        dutyRequirement: 'byDischarge',
        dateOfBirth: '1990-07-01',
        otherThanDishonorableDischarge: true,
      };

      expect(getEligibilityStatus(formData)).to.deep.equal({
        isDutyEligible: true,
        isDobEligible: true,
        isDischargeEligible: true,
        isFullyEligible: true,
      });
    });
  });
});
