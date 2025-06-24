import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  additionalOfficialArrayOptions,
  getCardTitle,
  getCardDescription,
  getReadOnlyPrimaryOfficialTitle,
  readOnlyCertifyingOfficialArrayOptions,
} from '../helpers';
import { readOnlyCertifyingOfficialIntro } from '../pages/readOnlyCertifyingOfficialIntro';

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
          phoneType: 'us',
          phoneNumber: '1234567890',
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
        '1234567890',
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
          phoneType: 'intl',
          internationalPhoneNumber: '1234567890',
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
      const { getByTestId } = render(description);

      expect(getByTestId('card-phone-number').innerHTML).to.include(
        '1234567890',
      );
      expect(getByTestId('card-email').innerHTML).to.include(
        'johndoe@gmail.com',
      );
      expect(getByTestId('card-training-date').innerHTML).to.include(
        '01/01/2020',
      );
      expect(getByTestId('card-has-va-benefits').innerHTML).to.include('No');
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
      expect(additionalOfficialArrayOptions.text.summaryTitle).to.equal(
        'Review your additional certifying officials',
      );
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
});
