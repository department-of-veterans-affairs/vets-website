import { expect } from 'chai';
import ReviewErrors, {
  ERROR_MESSAGES,
  CHAPTER_KEYS,
  PAGE_KEYS,
} from '../../constants/reviewErrors';

describe('ReviewErrors', () => {
  it('should return correct error message for simple fields', () => {
    expect(ReviewErrors.hasBeenAdjudicatedBankrupt).to.equal(
      ERROR_MESSAGES.BANKRUPTCY,
    );
    expect(ReviewErrors.realEstateValue).to.equal(
      ERROR_MESSAGES.REAL_ESTATE_VALUE,
    );
  });

  it('should return correct error message for indexed fields', () => {
    expect(ReviewErrors.resolutionOption(0)).to.equal(
      'Please select a resolution option for the first selected debt',
    );
    expect(ReviewErrors.resolutionOption(1)).to.equal(
      'Please select a resolution option for the second selected debt',
    );
  });

  it('should handle all defined error messages', () => {
    Object.keys(ReviewErrors).forEach(key => {
      if (typeof ReviewErrors[key] === 'function') {
        if (key !== '_override') {
          expect(ReviewErrors[key](0)).to.be.a('string');
        }
      } else {
        expect(ReviewErrors[key]).to.be.a('string');
      }
    });
  });
});

describe('_override', () => {
  const { _override } = ReviewErrors;

  it('should return correct mapping for known errors', () => {
    expect(_override('assets.realEstateValue')).to.deep.equal({
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.REAL_ESTATE_INFORMATION,
    });

    expect(_override('personalData.veteranFullName')).to.deep.equal({
      chapterKey: CHAPTER_KEYS.VETERAN_INFORMATION,
      pageKey: PAGE_KEYS.PERSONAL_INFORMATION,
    });
  });

  it('should return correct mapping for nested errors', () => {
    expect(_override('assets.monetaryAssets')).to.deep.equal({
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_ASSETS,
      pageKey: PAGE_KEYS.MONETARY_ASSETS,
    });

    expect(_override('additionalIncome.spouse')).to.deep.equal({
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_INCOME,
      pageKey: PAGE_KEYS.SPOUSE_ADDITIONAL_INCOME,
    });
  });

  it('should return correct mapping for top-level errors', () => {
    expect(_override('selectedDebtsAndCopays')).to.deep.equal({
      chapterKey: CHAPTER_KEYS.DEBTS_AND_COPAYS,
      pageKey: PAGE_KEYS.SELECTED_DEBTS,
    });

    expect(_override('utilityRecords')).to.deep.equal({
      chapterKey: CHAPTER_KEYS.HOUSEHOLD_EXPENSES,
      pageKey: PAGE_KEYS.UTILITIES,
    });
  });

  it('should return correct mapping for resolution amount errors', () => {
    const fullError = { __errors: ['Invalid resolution amount'] };
    expect(_override('someError', fullError)).to.deep.equal({
      chapterKey: CHAPTER_KEYS.RESOLUTION_OPTIONS,
      pageKey: PAGE_KEYS.RESOLUTION_OPTION,
    });
  });

  it('should return correct mapping for additionalData errors', () => {
    expect(_override('additionalData.bankruptcy')).to.deep.equal({
      chapterKey: CHAPTER_KEYS.BANKRUPTCY_ATTESTATION,
      pageKey: PAGE_KEYS.BANKRUPTCY_INFORMATION,
    });

    expect(_override('additionalData.additionalComments')).to.deep.equal({
      chapterKey: CHAPTER_KEYS.ADDITIONAL_INFORMATION,
      pageKey: PAGE_KEYS.ADDITIONAL_COMMENTS,
    });
  });

  it('should return null for unknown errors', () => {
    expect(_override('unknownError')).to.equal(null);
  });

  it('should return null for non-string inputs', () => {
    expect(_override(null)).to.equal(null);
    expect(_override(undefined)).to.equal(null);
    expect(_override({})).to.equal(null);
    expect(_override([])).to.equal(null);
  });
});
