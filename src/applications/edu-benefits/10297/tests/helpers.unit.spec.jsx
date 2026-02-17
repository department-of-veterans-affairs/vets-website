import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import {
  ConfirmationGoBackLink,
  ConfirmationWhatsNextProcessList,
  ConfirmationHowToContact,
  ConfirmationSubmissionAlert,
  getAgeInYears,
  trainingProviderArrayOptions,
  getCardDescription,
  validateTrainingProviderStartDate,
  dateSigned,
  viewifyFields,
  maskBankInformation,
  getPrefillIntlPhoneNumber,
  getTransformIntlPhoneNumber,
  parseDateToDateObj,
} from '../helpers';

describe('10297 Helpers', () => {
  describe('<ConfirmationSubmissionAlert />', () => {
    it('shows submission alert section with confirmation number', () => {
      const { container } = render(
        <ConfirmationSubmissionAlert confirmationNumber="1234567890" />,
      );
      expect(container.textContent).to.contain(
        'Your submission is in progress.',
      );
      expect(container.textContent).to.contain(
        'Your confirmation number is 1234567890.',
      );
    });

    it('shows submission alert section without confirmation number', () => {
      const { container } = render(<ConfirmationSubmissionAlert />);
      expect(container.textContent).to.contain(
        'Your submission is in progress.',
      );
      expect(container.textContent).to.not.contain(
        'Your confirmation number is',
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
      const action = container.querySelector('va-link-action');
      expect(action).to.exist;
      expect(action).to.have.attribute('href', '/');
      expect(action).to.have.attribute('text', 'Go back to VA.gov homepage');
    });
  });

  describe('<ConfirmationHowToContact />', () => {
    it('renders Ask VA link with correct attributes', () => {
      const { container } = render(<ConfirmationHowToContact />);
      const link = container.querySelector('va-link');
      expect(link).to.exist;
      expect(link).to.have.attribute('href', 'https://ask.va.gov/');
      expect(link).to.have.attribute('text', 'Ask VA');
    });
  });

  describe('#getAgeInYears', () => {
    let clock;
    beforeEach(() => {
      const fixed = new Date('2024-12-31T00:00:00Z').getTime();
      clock = sinon.useFakeTimers({ now: fixed, toFake: ['Date'] });
    });
    afterEach(() => clock.restore());

    it('should return the age in years', () => {
      expect(getAgeInYears('1963-01-01')).to.equal(61);
      expect(getAgeInYears('1962-12-31')).to.equal(62);
    });
  });

  describe('#dateSigned', () => {
    let clock;
    afterEach(() => clock?.restore());

    it('returns today +365 days', () => {
      clock = sinon.useFakeTimers({
        now: new Date('2025-01-01T00:00:00Z').getTime(),
        toFake: ['Date'],
      });
      // 365 days from 2025-01-01 => 2026-01-01
      expect(dateSigned()).to.equal('2026-01-01');
    });

    it('handles leap-year +365 correctly', () => {
      clock = sinon.useFakeTimers({
        now: new Date('2024-02-28T12:00:00Z').getTime(),
        toFake: ['Date'],
      });
      // Leap year: 365 days after 2024-02-28 => 2025-02-27
      expect(dateSigned()).to.equal('2025-02-27');
    });
  });
});

describe('trainingProviderArrayOptions', () => {
  it('should validate item completeness', () => {
    const item = {
      providerName: 'Training Provider',
      providerAddress: {
        country: 'USA',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
      },
    };
    expect(trainingProviderArrayOptions.isItemIncomplete(item)).to.be.false;
    expect(trainingProviderArrayOptions.isItemIncomplete({})).to.be.true;
  });

  it('should return correct item name', () => {
    expect(
      trainingProviderArrayOptions.text.getItemName({ providerName: 'X' }),
    ).to.equal('X');
    expect(trainingProviderArrayOptions.text.getItemName({})).to.equal(
      'training provider',
    );
  });

  it('should have expected text fields', () => {
    expect(trainingProviderArrayOptions.text.cancelAddYes).to.equal(
      'Yes, cancel',
    );
    expect(trainingProviderArrayOptions.text.cancelAddNo).to.equal(
      'No, continue adding information',
    );
    expect(trainingProviderArrayOptions.text.summaryTitle).to.equal(
      'Review your training provider information',
    );
  });
});

describe('getCardDescription', () => {
  it('renders address properly', () => {
    const card = {
      providerAddress: {
        country: 'USA',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
      },
    };
    const { getByTestId } = render(getCardDescription(card));
    expect(getByTestId('card-street').textContent).to.contain('123 Main St');
    expect(getByTestId('card-address').textContent).to.contain(
      'Anytown, CA 12345',
    );
  });

  it('handles postalCode "NA" with no state', () => {
    const card = {
      providerAddress: {
        country: 'USA',
        street: '456 Side St',
        city: 'Nowhere',
        postalCode: 'NA',
      },
    };
    const { getByTestId } = render(getCardDescription(card));
    expect(getByTestId('card-address').textContent.trim()).to.equal('Nowhere');
  });

  it('returns null when no item provided', () => {
    expect(getCardDescription(null)).to.be.null;
  });

  it('displays country name when country is not United States', () => {
    const card = {
      providerAddress: {
        country: 'CAN',
        street: '100 Queen St',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5H 2N2',
      },
    };
    const { getByTestId } = render(getCardDescription(card));
    expect(getByTestId('card-country').textContent).to.contain('Canada');
  });
});

describe('validateTrainingProviderStartDate', () => {
  it('allows valid dates', () => {
    const errors = { addError: sinon.spy() };
    validateTrainingProviderStartDate(errors, '2025-01-03');
    expect(errors.addError.called).to.be.false;
  });

  it('rejects invalid dates', () => {
    const errors = { addError: sinon.spy() };
    validateTrainingProviderStartDate(errors, '2025-01-01');
    expect(errors.addError.calledOnce).to.be.true;
  });

  it('does nothing on undefined date', () => {
    const errors = { addError: sinon.spy() };
    validateTrainingProviderStartDate(errors, undefined);
    expect(errors.addError.called).to.be.false;
  });
});

describe('#viewifyFields', () => {
  it('adds view: prefix and recurses objects', () => {
    const data = { a: 1, b: { c: 2 } };
    const result = viewifyFields(data);
    expect(result).to.have.property('view:a', 1);
    expect(result['view:b']).to.have.property('view:c', 2);
  });
});

describe('#maskBankInformation', () => {
  it('masks correctly', () => {
    expect(maskBankInformation('123456789', 4)).to.equal('●●●●●6789');
  });

  it('returns empty string for falsy input', () => {
    expect(maskBankInformation('', 4)).to.equal('');
    expect(maskBankInformation(null, 4)).to.equal('');
  });

  it('returns unmasked if shorter than unmaskedLength', () => {
    expect(maskBankInformation('123', 4)).to.equal('123');
  });
});

describe('#getPrefillIntlPhoneNumber', () => {
  it('should create formatted international phone number with provided details', () => {
    const phone = {
      areaCode: '111',
      countryCode: '1',
      phoneNumber: '2223333',
    };

    expect(getPrefillIntlPhoneNumber(phone)).to.deep.equal({
      callingCode: 1,
      countryCode: 'US',
      contact: '1112223333',
    });
  });

  it('should return an empty string with no provided details', () => {
    expect(getPrefillIntlPhoneNumber()).to.deep.equal({
      callingCode: 1,
      countryCode: 'US',
      contact: '',
    });
  });
});

describe('#getTransformIntlPhoneNumber', () => {
  it('should create formatted international phone number with provided details', () => {
    const phoneNumber = {
      callingCode: 1,
      countryCode: 'US',
      contact: '1112223333',
    };

    expect(getTransformIntlPhoneNumber(phoneNumber)).to.equal(
      '+1 1112223333 (US)',
    );
  });

  it('should return an empty string with no provided details', () => {
    expect(getTransformIntlPhoneNumber()).to.equal('');
  });
  describe('parseDateToDateObj', () => {
    it('should parse ISO8601 date string with T', () => {
      const result = parseDateToDateObj('2023-10-15T10:30:00.000Z');
      expect(result).to.be.instanceOf(Date);
      expect(result.getFullYear()).to.equal(2023);
      expect(result.getMonth()).to.equal(9); // October is month 9
      expect(result.getDate()).to.equal(15);
    });
    it('should parse date string with template', () => {
      const result = parseDateToDateObj('10/15/2023', 'MM/dd/yyyy');
      expect(result).to.be.instanceOf(Date);
      expect(result.getFullYear()).to.equal(2023);
      expect(result.getMonth()).to.equal(9);
      expect(result.getDate()).to.equal(15);
    });
    it('should handle Date object input', () => {
      const inputDate = new Date('2023-10-15');
      const result = parseDateToDateObj(inputDate);
      expect(result).to.be.instanceOf(Date);
    });
  });
});
