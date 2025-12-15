import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  additionalOfficialArrayOptions,
  getCardTitle,
  getCardDescription,
  getReadOnlyPrimaryOfficialTitle,
  readOnlyCertifyingOfficialArrayOptions,
  capitalizeFirstLetter,
  getTransformIntlPhoneNumber,
} from '../helpers';
import { readOnlyCertifyingOfficialIntro } from '../pages/readOnlyCertifyingOfficialIntro';
import { additionalOfficialIntro } from '../pages/additionalOfficialIntro';

describe('8794 helpers ', () => {
  describe('getCardTitle', () => {
    it('should render card title with middle name', () => {
      expect(
        getCardTitle({
          additionalOfficialDetails: {
            fullName: {
              first: 'John',
              middle: 'Jacob',
              last: 'Doe',
            },
            title: 'Administrator',
          },
        }),
      ).to.equal('John Jacob Doe, Administrator');
    });
    it('should render card title without middle name', () => {
      expect(
        getCardTitle({
          additionalOfficialDetails: {
            fullName: {
              first: 'John',
              last: 'Doe',
            },
            title: 'Administrator',
          },
        }),
      ).to.equal('John Doe, Administrator');
    });

    it('should render card title with empty values', () => {
      expect(
        getCardTitle({
          certifyingOfficial: {},
        }),
      ).to.equal('Certifying Official, Title');
    });

    it('should handle when the given item is null', () => {
      expect(getCardTitle(null)).to.equal(null);
    });
  });

  describe('getCardDescription', () => {
    it('should return a full description of details from the given card details', () => {
      const card = {
        additionalOfficialDetails: {
          fullName: {
            first: 'John',
            middle: 'Jacob',
            last: 'Doe',
          },
          title: 'Official',
          phoneNumber: {
            callingCode: '1',
            contact: '5162098611',
            countryCode: 'US',
          },
          emailAddress: 'johndoe@gmail.com',
        },
        additionalOfficialTraining: {
          trainingExempt: false,
        },
        additionalOfficialBenefitStatus: {
          hasVaEducationBenefits: true,
        },
      };

      const description = getCardDescription(card);
      const { getByTestId } = render(description);

      expect(getByTestId('card-phone-number').innerHTML).to.include(
        '+1 5162098611 (US)',
      );
      expect(getByTestId('card-email').innerHTML).to.include(
        'johndoe@gmail.com',
      );
      expect(getByTestId('card-training-date').innerHTML).to.include('Exempt');
      expect(getByTestId('card-has-va-benefits').innerHTML).to.include('Yes');
    });
    it('should return a full description of details from the given card details with international phone number', () => {
      const card = {
        additionalOfficialDetails: {
          fullName: {
            first: 'John',
            middle: 'Jacob',
            last: 'Doe',
          },
          title: 'Official',
          phoneNumber: {
            callingCode: '44',
            contact: '1234567890',
            countryCode: 'GB',
          },
          emailAddress: 'johndoe@gmail.com',
        },
        additionalOfficialTraining: {
          trainingCompletionDate: '2020-01-01',
        },
        additionalOfficialBenefitStatus: {
          hasVaEducationBenefits: false,
        },
      };

      const description = getCardDescription(card);
      const { container } = render(description);

      expect(
        container.querySelector('[data-testid="card-phone-number"]').innerHTML,
      ).to.include('+44 1234567890 (GB)');
      expect(
        container.querySelector('[data-testid="card-email"]').innerHTML,
      ).to.include('johndoe@gmail.com');
      expect(
        container.querySelector('[data-testid="card-training-date"]').innerHTML,
      ).to.include('01/01/2020');
      expect(
        container.querySelector('[data-testid="card-has-va-benefits"]')
          .innerHTML,
      ).to.include('No');
    });
    it('should handle when each card field is empty', () => {
      const card = null;
      const description = getCardDescription(card);
      expect(description).to.equal(null);
    });
  });

  describe('additionalOfficialArrayOptions', () => {
    it('should return correct card description using getItemName', () => {
      const item = {
        additionalOfficialDetails: {
          fullName: {
            first: 'John',
            middle: 'Jacob',
            last: 'Doe',
          },
          title: 'Administrator',
        },
      };
      expect(additionalOfficialArrayOptions.text.getItemName(item)).to.equal(
        'John Jacob Doe, Administrator',
      );
    });

    it('should have text fields set for custom messages', () => {
      expect(additionalOfficialArrayOptions.text.cancelAddYes).to.equal(
        'Yes, cancel',
      );
      expect(additionalOfficialArrayOptions.text.cancelAddNo).to.equal(
        'No, continue adding information',
      );
    });
    it('summaryTitle pluralises correctly', () => {
      const zero = { formData: { 'additional-certifying-official': [] } };
      const two = { formData: { 'additional-certifying-official': [{}, {}] } };

      expect(additionalOfficialArrayOptions.text.summaryTitle(zero)).to.equal(
        'Review your additional certifying official',
      );
      expect(additionalOfficialArrayOptions.text.summaryTitle(two)).to.equal(
        'Review your additional certifying officials',
      );
    });
    it('summaryDescriptionWithoutItems shows intro only when list is empty', () => {
      const empty = { formData: { 'additional-certifying-official': [] } };
      const nonEmpty = { formData: { 'additional-certifying-official': [{}] } };

      expect(
        additionalOfficialArrayOptions.text.summaryDescriptionWithoutItems(
          empty,
        ),
      ).to.equal(additionalOfficialIntro);
      expect(
        additionalOfficialArrayOptions.text.summaryDescriptionWithoutItems(
          nonEmpty,
        ),
      ).to.equal(null);
    });
  });

  describe('getReadOnlyPrimaryOfficialTitle', () => {
    it('returns "first  last" (double-space) when no middle name', () => {
      const item = { fullName: { first: 'John', last: 'Doe' } };
      expect(getReadOnlyPrimaryOfficialTitle(item)).to.equal('John Doe');
    });

    it('falls back to "Certifying  last" when first is blank', () => {
      const item = { fullName: { first: '', last: 'Doe' } };
      expect(getReadOnlyPrimaryOfficialTitle(item)).to.equal('Certifying Doe');
    });

    it('falls back to "first  Official" when last is blank', () => {
      const item = { fullName: { first: 'John', last: '' } };
      expect(getReadOnlyPrimaryOfficialTitle(item)).to.equal('John Official');
    });

    it('returns null when item is null', () => {
      expect(getReadOnlyPrimaryOfficialTitle(null)).to.equal(null);
    });
  });

  describe('readOnlyCertifyingOfficialArrayOptions.text helpers', () => {
    const { text } = readOnlyCertifyingOfficialArrayOptions;

    it('getItemName returns "first  last" when no middle', () => {
      const item = { fullName: { first: 'Jane', last: 'Smith' } };
      expect(text.getItemName(item)).to.equal('Jane Smith');
    });

    it('summaryTitle pluralises correctly', () => {
      const zero = { formData: { readOnlyCertifyingOfficials: [] } };
      const two = { formData: { readOnlyCertifyingOfficials: [{}, {}] } };

      expect(text.summaryTitle(zero)).to.equal(
        'Review your read-only certifying official',
      );
      expect(text.summaryTitle(two)).to.equal(
        'Review your read-only certifying officials',
      );
    });

    it('summaryDescriptionWithoutItems shows intro only when list is empty', () => {
      const empty = { formData: { readOnlyCertifyingOfficials: [] } };
      const nonEmpty = { formData: { readOnlyCertifyingOfficials: [{}] } };

      expect(text.summaryDescriptionWithoutItems(empty)).to.equal(
        readOnlyCertifyingOfficialIntro,
      );
      expect(text.summaryDescriptionWithoutItems(nonEmpty)).to.equal(null);
    });

    it('summaryTitleWithoutItems returns the fixed heading', () => {
      expect(text.summaryTitleWithoutItems).to.equal(
        'Add read-only certifying officials',
      );
    });
  });
  describe('capitalizeFirstLetter', () => {
    it('returns empty string for falsy/undefined/null', () => {
      expect(capitalizeFirstLetter()).to.equal('');
      expect(capitalizeFirstLetter(null)).to.equal('');
      expect(capitalizeFirstLetter('')).to.equal('');
    });

    it('returns empty string for non-string inputs', () => {
      expect(capitalizeFirstLetter(123)).to.equal('');
      expect(capitalizeFirstLetter(true)).to.equal('');
      expect(capitalizeFirstLetter({})).to.equal('');
      expect(capitalizeFirstLetter([])).to.equal('');
      expect(capitalizeFirstLetter(() => {})).to.equal('');
    });

    it('capitalizes first character of a lowercase word', () => {
      expect(capitalizeFirstLetter('apple')).to.equal('Apple');
      expect(capitalizeFirstLetter('banana split')).to.equal('Banana split');
    });

    it('handles single-character strings', () => {
      expect(capitalizeFirstLetter('a')).to.equal('A');
      expect(capitalizeFirstLetter('z')).to.equal('Z');
    });

    it('leaves already-capitalized first letter unchanged', () => {
      expect(capitalizeFirstLetter('Apple')).to.equal('Apple');
      expect(capitalizeFirstLetter('USA')).to.equal('USA');
    });

    it('works with non-ASCII letters (basic unicode)', () => {
      expect(capitalizeFirstLetter('ábc')).to.equal('Ábc');
      expect(capitalizeFirstLetter('ñandú')).to.equal('Ñandú');
    });
  });
  describe('getTransformIntlPhoneNumber', () => {
    it('should format US phone numbers correctly', () => {
      const phoneNumber = {
        callingCode: '1',
        contact: '5551234567',
        countryCode: 'US',
      };
      const transformed = getTransformIntlPhoneNumber(phoneNumber);
      expect(transformed).to.equal('+1 5551234567 (US)');
    });

    it('should format UK phone numbers correctly', () => {
      const phoneNumber = {
        callingCode: '44',
        contact: '2079460128',
        countryCode: 'GB',
      };
      const transformed = getTransformIntlPhoneNumber(phoneNumber);
      expect(transformed).to.equal('+44 2079460128 (GB)');
    });

    it('should handle missing phone number fields gracefully', () => {
      const phoneNumber = {
        callingCode: '',
        contact: '',
        countryCode: '',
      };
      const transformed = getTransformIntlPhoneNumber(phoneNumber);
      expect(transformed).to.equal('');
    });

    it('should handle null phone number object', () => {
      const transformed = getTransformIntlPhoneNumber(null);
      expect(transformed).to.equal('');
    });

    it('should handle undefined phone number object', () => {
      const transformed = getTransformIntlPhoneNumber(undefined);
      expect(transformed).to.equal('');
    });
  });
});
