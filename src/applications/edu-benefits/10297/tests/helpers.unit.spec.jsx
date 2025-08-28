import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import {
  ConfirmationGoBackLink,
  ConfirmationWhatsNextProcessList,
  getAgeInYears,
  getEligibilityStatus,
  trainingProviderArrayOptions,
  getCardDescription,
  validateWithin180Days,
  validateTrainingProviderStartDate,
  ConfirmationSubmissionAlert,
} from '../helpers';

describe('10297 Helpers', () => {
  describe('<ConfirmationSubmissionAlert />', () => {
    it('shows submission alert section', () => {
      const confirmationNumber = '1234567890';

      const { container } = render(
        <ConfirmationSubmissionAlert confirmationNumber={confirmationNumber} />,
      );

      // Confirmation Number
      expect(container.innerHTML).to.include('1234567890');
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
        'Go back to VA.gov homepage',
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

  describe('trainingProvierArrayOptions', () => {
    it('should return correct isItemComplete', () => {
      const item = {
        providerName: 'Training Provider Example',
        providerAddress: {
          country: 'USA',
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postalCode: '12345',
        },
      };
      const emptyItem = {};
      expect(trainingProviderArrayOptions.isItemIncomplete(item)).to.equal(
        false,
      );
      expect(trainingProviderArrayOptions.isItemIncomplete(emptyItem)).to.equal(
        true,
      );
    });

    it('should return correct card title using getItemName', () => {
      const item = {
        providerName: 'Training Provider Example',
      };
      const emptyItem = {};
      expect(trainingProviderArrayOptions.text.getItemName(item)).to.equal(
        'Training Provider Example',
      );
      expect(trainingProviderArrayOptions.text.getItemName(emptyItem)).to.equal(
        'training provider',
      );
    });

    it('should have text fields set for custom messages', () => {
      expect(trainingProviderArrayOptions.text.cancelAddYes).to.equal(
        'Yes, cancel',
      );
      expect(trainingProviderArrayOptions.text.cancelAddNo).to.equal(
        'No, continue adding information',
      );
      expect(trainingProviderArrayOptions.text.summaryTitle).to.equal(
        'Review your training provider information',
      );
      expect(trainingProviderArrayOptions.text.cancelAddButtonText).to.equal(
        'Cancel adding this training provider',
      );
    });
  });
  describe('getCardDescription', () => {
    it('should return a full description of details from the given card details', () => {
      const card = {
        providerAddress: {
          country: 'USA',
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postalCode: '12345',
        },
      };

      const description = getCardDescription(card);
      const { getByTestId } = render(description);

      expect(getByTestId('card-street').innerHTML).to.include('123 Main St');
      expect(getByTestId('card-address').innerHTML).to.include(
        'Anytown, CA 12345',
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

  describe('validateTrainingProviderStartDate()', () => {
    it('does nothing (passes) when given a date after the program start date', () => {
      const errors = { addError: sinon.spy() };
      validateTrainingProviderStartDate(errors, '2025-01-03');
      expect(errors.addError.called).to.be.false;
    });

    it('adds an error when given a date before the program start date', () => {
      const errors = { addError: sinon.spy() };
      validateTrainingProviderStartDate(errors, '2025-01-01');
      expect(errors.addError.calledOnce).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.match(
        /Training must start/i,
      );
    });

    it('does nothing when no date string is provided', () => {
      const errors = { addError: sinon.spy() };
      validateTrainingProviderStartDate(errors, undefined);
      expect(errors.addError.called).to.be.false;
    });
  });
});
