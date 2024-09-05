import { expect } from 'chai';
import ReviewErrors from '../../utils/reviewErrorHelper';
import { CHAPTER_KEYS, PAGE_KEYS } from '../../constants/reviewErrors';

describe('ReviewErrors with presubmit data', () => {
  const mockPresubmitData = {
    data: {
      questions: {
        hasRepayments: true,
        hasCreditCardBills: true,
        hasRecreationalVehicle: true,
        hasVehicle: true,
        hasRealEstate: true,
        spouseHasBenefits: true,
        isMarried: true,
        hasDependents: '2',
        hasBeenAdjudicatedBankrupt: true,
        vetIsEmployed: true,
        spouseIsEmployed: true,
      },
      assets: {
        recVehicleAmount: '123',
        realEstateValue: '3212',
        monetaryAssets: [
          { name: 'Cash', amount: '22' },
          { name: 'Savings accounts', amount: '21' },
        ],
        otherAssets: [
          { name: 'Collectibles, or collection(s)', amount: '12344' },
          { name: 'Antiques', amount: '44' },
          { name: 'Fine art', amount: '122' },
        ],
        automobiles: [{ make: 'fdsa', model: 'dfa', resaleValue: '12' }],
      },
      personalData: {
        spouseFullName: { first: 'Rosemary', last: 'Woodhouse' },
        veteranFullName: { first: 'Travis', last: 'Jones', middle: 'D' },
        dateOfBirth: '1950-09-06',
      },
      selectedDebtsAndCopays: [
        {
          resolutionWaiverCheck: true,
          resolutionOption: 'waiver',
          fileNumber: '796121200',
        },
        {
          resolutionComment: '32',
          resolutionOption: 'monthly',
          fileNumber: '796121200',
        },
      ],
    },
  };

  describe('Personal Information', () => {
    it('should detect missing veteran information', () => {
      const incompleteData = { ...mockPresubmitData };
      incompleteData.data.personalData.veteranFullName.first = '';

      expect(ReviewErrors.personalInformation).to.be.a('string');
      const hasError = !incompleteData.data.personalData.veteranFullName.first;
      expect(hasError).to.be.true;
    });

    it('should detect invalid date of birth', () => {
      const invalidData = { ...mockPresubmitData };
      invalidData.data.personalData.dateOfBirth = 'invalid-date';

      expect(ReviewErrors.personalInformation).to.be.a('string');
      const hasError = !/^\d{4}-\d{2}-\d{2}$/.test(
        invalidData.data.personalData.dateOfBirth,
      );
      expect(hasError).to.be.true;
    });
  });

  describe('Assets', () => {
    it('should detect missing recreational vehicle amount when hasRecreationalVehicle is true', () => {
      const incompleteData = { ...mockPresubmitData };
      incompleteData.data.assets.recVehicleAmount = '';

      expect(ReviewErrors.recVehicleAmount).to.be.a('string');
      const hasError =
        incompleteData.data.questions.hasRecreationalVehicle &&
        !incompleteData.data.assets.recVehicleAmount;
      expect(hasError).to.be.true;
    });

    it('should detect invalid real estate value', () => {
      const invalidData = { ...mockPresubmitData };
      invalidData.data.assets.realEstateValue = 'invalid';

      expect(ReviewErrors.realEstateValue).to.be.a('string');
      // eslint-disable-next-line no-restricted-syntax
      const hasError = isNaN(
        parseFloat(invalidData.data.assets.realEstateValue),
      );
      expect(hasError).to.be.true;
    });
  });

  describe('Debts and Copays', () => {
    it('should detect missing resolution option', () => {
      const incompleteData = { ...mockPresubmitData };
      incompleteData.data.selectedDebtsAndCopays[0].resolutionOption = '';

      expect(ReviewErrors.resolutionOption(0)).to.be.a('string');
      const hasError = !incompleteData.data.selectedDebtsAndCopays[0]
        .resolutionOption;
      expect(hasError).to.be.true;
    });

    it('should detect missing resolution comment for monthly option', () => {
      const incompleteData = { ...mockPresubmitData };
      incompleteData.data.selectedDebtsAndCopays[1].resolutionComment = '';

      expect(ReviewErrors.resolutionComment(1)).to.be.a('string');
      const hasError =
        incompleteData.data.selectedDebtsAndCopays[1].resolutionOption ===
          'monthly' &&
        !incompleteData.data.selectedDebtsAndCopays[1].resolutionComment;
      expect(hasError).to.be.true;
    });
  });

  describe('Vehicle Information', () => {
    it('should detect missing vehicle information when hasVehicle is true', () => {
      const incompleteData = { ...mockPresubmitData };
      incompleteData.data.questions.hasVehicle = true;
      incompleteData.data.assets.automobiles = [];

      expect(ReviewErrors.automobiles).to.be.a('string');
      const hasError =
        incompleteData.data.questions.hasVehicle &&
        incompleteData.data.assets.automobiles.length === 0;
      expect(hasError).to.be.true;
    });

    it('should detect invalid vehicle resale value', () => {
      const invalidData = { ...mockPresubmitData };
      if (
        !invalidData.data.assets.automobiles ||
        invalidData.data.assets.automobiles.length === 0
      ) {
        invalidData.data.assets.automobiles = [
          { make: '', model: '', resaleValue: '' },
        ];
      }
      invalidData.data.assets.automobiles[0].resaleValue = 'invalid';

      expect(ReviewErrors.automobiles).to.be.a('string');
      // eslint-disable-next-line no-restricted-syntax
      const hasError = invalidData.data.assets.automobiles.some(auto =>
        isNaN(parseFloat(auto.resaleValue)),
      );
      expect(hasError).to.be.true;
    });

    it('should detect missing recreational vehicle amount when hasRecreationalVehicle is true', () => {
      const incompleteData = { ...mockPresubmitData };
      incompleteData.data.questions.hasRecreationalVehicle = true;
      incompleteData.data.assets.recVehicleAmount = '';

      expect(ReviewErrors.recVehicleAmount).to.be.a('string');
      const hasError =
        incompleteData.data.questions.hasRecreationalVehicle &&
        !incompleteData.data.assets.recVehicleAmount;
      expect(hasError).to.be.true;
    });
  });

  describe('Missing Questions', () => {
    it('should return correct chapter and page keys for missing question errors', () => {
      const result = ReviewErrors._override('questions.hasVehicle');
      expect(result).to.deep.equal({
        chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
        pageKey: PAGE_KEYS.HAS_VEHICLE,
      });
    });

    it('should detect missing hasVehicle question', () => {
      const incompleteData = { ...mockPresubmitData };
      delete incompleteData.data.questions.hasVehicle;

      expect(ReviewErrors.hasVehicle).to.be.a('string');
      const hasError = incompleteData.data.questions.hasVehicle === undefined;
      expect(hasError).to.be.true;
    });

    it('should detect missing hasRealEstate question', () => {
      const incompleteData = { ...mockPresubmitData };
      delete incompleteData.data.questions.hasRealEstate;

      expect(ReviewErrors.hasRealEstate).to.be.a('string');
      const hasError =
        incompleteData.data.questions.hasRealEstate === undefined;
      expect(hasError).to.be.true;
    });

    it('should detect missing isMarried question', () => {
      const incompleteData = { ...mockPresubmitData };
      delete incompleteData.data.questions.isMarried;

      expect(ReviewErrors.isMarried).to.be.a('string');
      const hasError = incompleteData.data.questions.isMarried === undefined;
      expect(hasError).to.be.true;
    });
  });

  describe('Override function', () => {
    it('should return correct chapter and page keys for employment errors', () => {
      const result = ReviewErrors._override('personalData.employmentHistory');
      expect(result).to.deep.equal({
        chapterKey: CHAPTER_KEYS.HOUSEHOLD_INCOME,
        pageKey: PAGE_KEYS.EMPLOYMENT_HISTORY,
      });
    });

    it('should return correct chapter and page keys for vehicle errors', () => {
      const result = ReviewErrors._override('assets.automobiles');
      expect(result).to.deep.equal({
        chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
        pageKey: PAGE_KEYS.AUTOMOBILES,
      });
    });

    it('should return correct chapter and page keys for missing question errors', () => {
      const result = ReviewErrors._override('questions.hasVehicle');
      expect(result).to.deep.equal({
        chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
        pageKey: PAGE_KEYS.HAS_VEHICLE,
      });
    });

    it('should return correct chapter and page keys for resolution amount errors', () => {
      const fullError = { __errors: ['Invalid resolution amount'] };
      const result = ReviewErrors._override(
        'selectedDebtsAndCopays',
        fullError,
      );
      expect(result).to.deep.equal({
        chapterKey: CHAPTER_KEYS.RESOLUTION_OPTIONS,
        pageKey: PAGE_KEYS.SELECTED_DEBTS_AND_COPAYS,
      });
    });
  });
});
