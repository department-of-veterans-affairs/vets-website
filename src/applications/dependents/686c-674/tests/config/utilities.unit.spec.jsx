import { expect } from 'chai';
import {
  createGetHandler,
  jsonResponse,
  networkError,
  setupServer,
} from 'platform/testing/unit/msw-adapter';
import {
  customFormReplacer,
  isClientError,
  isServerError,
  getData,
  validateName,
  spouseEvidence,
  childEvidence,
  checkAddingDependentsNot674ForPension,
  checkAdding674ForPension,
  showPensionBackupPath,
  isVetInReceiptOfPension,
  showPensionRelatedQuestions,
  show674IncomeQuestions,
  buildSubmissionData,
} from '../../config/utilities';

describe('Utilities', () => {
  it('parses client errors', () => {
    expect(isClientError(500)).to.be.false;
    expect(isClientError(400)).to.be.true;
  });

  it('parses server errors', () => {
    expect(isServerError(500)).to.be.true;
    expect(isServerError(400)).to.be.false;
  });

  it('parses forms', () => {
    expect(customFormReplacer('test', {})).to.be.undefined;
    expect(
      customFormReplacer('test', { widget: 'autosuggest', id: 1 }),
    ).to.be.eq(1);
    expect(
      customFormReplacer('test', { confirmationCode: 'test', file: 'test' }),
    ).to.be.deep.eq({ confirmationCode: 'test' });
    expect(
      customFormReplacer('test', [{ widget: 'autosuggest', id: 1 }]),
    ).to.be.an('array');
    expect(customFormReplacer('test', [])).to.be.undefined;
    expect(customFormReplacer('test', 1)).to.be.eq(1);
  });
});

describe('getData', () => {
  const server = setupServer();

  before(() => {
    server.listen();
  });
  after(() => {
    server.close();
  });

  it('should succeed', async () => {
    server.use(
      createGetHandler(`https://dev-api.va.gov/v0/some/api-route`, () =>
        jsonResponse({ data: { attributes: { name: 'John' } } }),
      ),
    );

    const response = await getData('/some/api-route');
    expect(response).to.eql({ name: 'John' });
  });

  it('should fail', async () => {
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/some/api-route`,
        networkError(),
      ),
    );

    const response = await getData('/some/api-route');
    expect(response).to.throw;
  });
});

describe('validateName', () => {
  it('should validate the name', () => {
    const response1 = validateName(
      { first: false, last: false },
      { first: 'Bob', last: 'Last' },
    );
    expect(response1).to.be.undefined;
  });
});

describe('isServerError', () => {
  it('should return true for server errors (5xx)', () => {
    expect(isServerError('500')).to.be.true;
    expect(isServerError('501')).to.be.true;
    expect(isServerError('599')).to.be.true;
  });

  it('should return false for non-server errors', () => {
    expect(isServerError('400')).to.be.false;
    expect(isServerError('200')).to.be.false;
    expect(isServerError('404')).to.be.false;
  });
});

describe('isClientError', () => {
  it('should return true for client errors (4xx)', () => {
    expect(isClientError('400')).to.be.true;
    expect(isClientError('404')).to.be.true;
    expect(isClientError('499')).to.be.true;
  });

  it('should return false for non-client errors', () => {
    expect(isClientError('500')).to.be.false;
    expect(isClientError('200')).to.be.false;
    expect(isClientError('201')).to.be.false;
  });
});

describe('spouseEvidence', () => {
  const data = (typeOfMarriage, country = 'USA', isMilitary = false) => ({
    veteranContactInformation: { veteranAddress: { country, isMilitary } },
    currentMarriageInformation: { typeOfMarriage },
  });
  it('should return all false boolean values', () => {
    expect(spouseEvidence(data('CEREMONIAL'))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: false,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: false,
    });
    expect(spouseEvidence(data(123))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: false,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: false,
    });
  });
  it('should return true for outside USA', () => {
    expect(spouseEvidence(data('', 'USA', true)).isOutsideUSA).to.be.true;
    expect(spouseEvidence(data('', 'XYZ', false)).isOutsideUSA).to.be.true;
  });
  it('should return true for uploads', () => {
    expect(spouseEvidence(data('CIVIL'))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: false,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: true,
    });
    expect(spouseEvidence(data('COMMON-LAW'))).to.deep.equal({
      isCommonLawMarriage: true,
      isTribalMarriage: false,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: true,
    });
    expect(spouseEvidence(data('TRIBAL'))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: true,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: true,
    });
    expect(spouseEvidence(data('PROXY'))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: false,
      isProxyMarriage: true,
      isOutsideUSA: false,
      needsSpouseUpload: true,
    });
    expect(spouseEvidence(data('OTHER'))).to.deep.equal({
      isCommonLawMarriage: false,
      isTribalMarriage: false,
      isProxyMarriage: false,
      isOutsideUSA: false,
      needsSpouseUpload: true,
    });
  });
});

describe('childEvidence', () => {
  const data = ({
    relationship,
    permanent = false,
    country = 'USA',
    isMilitary = false,
  } = {}) => ({
    veteranContactInformation: { veteranAddress: { country, isMilitary } },
    childrenToAdd: [
      {},
      { relationshipToChild: {} },
      {
        relationshipToChild: {
          stepchild: relationship === 'stepchild',
          adopted: relationship === 'adopted',
        },
        doesChildHaveDisability: true,
        doesChildHavePermanentDisability: permanent,
      },
    ],
  });

  it('should return all false boolean values', () => {
    expect(childEvidence(data())).to.deep.equal({
      showBirthCertificate: false,
      hasAdoptedChild: false,
      hasDisabledChild: false,
      needsChildUpload: false,
    });
  });

  it('should return true for birth certificate', () => {
    expect(childEvidence(data({ country: 'XYZ' }))).to.deep.equal({
      showBirthCertificate: true,
      hasAdoptedChild: false,
      hasDisabledChild: false,
      needsChildUpload: true,
    });
    expect(childEvidence(data({ isMilitary: true }))).to.deep.equal({
      showBirthCertificate: true,
      hasAdoptedChild: false,
      hasDisabledChild: false,
      needsChildUpload: true,
    });
  });

  it('should return true for stepchild', () => {
    expect(childEvidence(data({ relationship: 'stepchild' }))).to.deep.equal({
      showBirthCertificate: true,
      hasAdoptedChild: false,
      hasDisabledChild: false,
      needsChildUpload: true,
    });
  });

  it('should return true for adopted child', () => {
    expect(childEvidence(data({ relationship: 'adopted' }))).to.deep.equal({
      showBirthCertificate: false,
      hasAdoptedChild: true,
      hasDisabledChild: false,
      needsChildUpload: true,
    });
  });

  it('should return true for disabled child', () => {
    expect(childEvidence(data({ permanent: true }))).to.deep.equal({
      showBirthCertificate: false,
      hasAdoptedChild: false,
      hasDisabledChild: true,
      needsChildUpload: true,
    });
  });
});

describe('checkAddingDependentsNot674ForPension', () => {
  it('should return false if not adding dependents', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: false, remove: true },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.false;
  });

  it('should return true if adding dependents outside of 674', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { addSpouse: true, report674: true },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.true;
  });

  it('should return false if not adding dependents outside of 674', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: false, remove: true },
      'view:addDependentOptions': { addSpouse: false, report674: true },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.false;
  });

  it('should return false if only adding 674', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { addSpouse: false, report674: true },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.false;
  });

  it('should return true when adding child', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { addChild: true, report674: false },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.true;
  });

  it('should return true when adding disabled child', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { addDisabledChild: true, report674: false },
    };
    expect(checkAddingDependentsNot674ForPension(formData)).to.be.true;
  });

  it('should return false with empty form data', () => {
    expect(checkAddingDependentsNot674ForPension({})).to.be.undefined;
  });

  it('should return false with undefined form data', () => {
    expect(checkAddingDependentsNot674ForPension()).to.be.undefined;
  });
});

describe('checkAdding674ForPension', () => {
  it('should return true when adding 674 dependents', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { report674: true, addSpouse: false },
    };
    expect(checkAdding674ForPension(formData)).to.be.true;
  });

  it('should return false if not adding dependents', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: false, remove: true },
      'view:addDependentOptions': { report674: true },
    };
    expect(checkAdding674ForPension(formData)).to.be.false;
  });

  it('should return false if report674 is false', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': { report674: false, addSpouse: true },
    };
    expect(checkAdding674ForPension(formData)).to.be.false;
  });

  it('should return false with empty form data', () => {
    expect(checkAdding674ForPension({})).to.be.undefined;
  });

  it('should return false with undefined form data', () => {
    expect(checkAdding674ForPension()).to.be.undefined;
  });

  it('should return true when adding 674 along with other dependents', () => {
    const formData = {
      'view:addOrRemoveDependents': { add: true, remove: false },
      'view:addDependentOptions': {
        report674: true,
        addSpouse: true,
        addChild: true,
      },
    };
    expect(checkAdding674ForPension(formData)).to.be.true;
  });
});

describe('isVetInReceiptOfPension', () => {
  it('should return true when isInReceiptOfPension is 1', () => {
    const formData = {
      veteranInformation: { isInReceiptOfPension: 1 },
    };
    expect(isVetInReceiptOfPension(formData)).to.be.true;
  });

  it('should return false when isInReceiptOfPension is 0', () => {
    const formData = {
      veteranInformation: { isInReceiptOfPension: 0 },
    };
    expect(isVetInReceiptOfPension(formData)).to.be.false;
  });

  it('should return true when isInReceiptOfPension is -1 and backup path indicates pension', () => {
    const formData = {
      veteranInformation: { isInReceiptOfPension: -1 },
      'view:checkVeteranPension': true,
    };
    expect(isVetInReceiptOfPension(formData)).to.be.true;
  });

  it('should return false when isInReceiptOfPension is -1 and backup path indicates no pension', () => {
    const formData = {
      veteranInformation: { isInReceiptOfPension: -1 },
      'view:checkVeteranPension': false,
    };
    expect(isVetInReceiptOfPension(formData)).to.be.false;
  });

  it('should return false when isInReceiptOfPension is -1 and no backup path data', () => {
    const formData = {
      veteranInformation: { isInReceiptOfPension: -1 },
    };
    expect(isVetInReceiptOfPension(formData)).to.be.undefined;
  });

  it('should return false with empty form data', () => {
    expect(isVetInReceiptOfPension({})).to.be.false;
  });

  it('should return false with undefined form data', () => {
    expect(isVetInReceiptOfPension()).to.be.false;
  });

  it('should return false when veteranInformation is missing', () => {
    const formData = {
      'view:checkVeteranPension': true,
    };
    expect(isVetInReceiptOfPension(formData)).to.be.false;
  });
});

describe('showPensionBackupPath', () => {
  describe('when feature flag - vaDependentsNetWorthAndPension - is off', () => {
    it('should return false', () => {
      expect(showPensionBackupPath({ vaDependentsNetWorthAndPension: false }))
        .to.be.false;
    });
  });

  describe('when feature flag - vaDependentsNetWorthAndPension - is on', () => {
    describe('when adding dependents - not 674', () => {
      it('should return true if isInReceiptOfPension is -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addSpouse: true, report674: false },
          }),
        ).to.be.true;
      });

      it('should return false if isInReceiptOfPension is not -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addSpouse: true, report674: false },
          }),
        ).to.be.false;
      });

      it('should return true when adding child and isInReceiptOfPension is -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addChild: true, report674: false },
          }),
        ).to.be.true;
      });

      it('should return true when adding disabled child and isInReceiptOfPension is -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': {
              addDisabledChild: true,
              report674: false,
            },
          }),
        ).to.be.true;
      });
    });

    describe('when adding dependents - 674 only', () => {
      it('should return true if isInReceiptOfPension is -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addSpouse: false, report674: true },
          }),
        ).to.be.true;
      });

      it('should return false if isInReceiptOfPension is not -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addSpouse: false, report674: true },
          }),
        ).to.be.false;
      });
    });

    describe('when adding both 674 and non-674 dependents', () => {
      it('should return true if isInReceiptOfPension is -1', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { addSpouse: true, report674: true },
          }),
        ).to.be.true;
      });
    });

    describe('edge cases', () => {
      it('should return false with empty form data', () => {
        expect(showPensionBackupPath({})).to.be.undefined;
      });

      it('should return false with undefined form data', () => {
        expect(showPensionBackupPath()).to.be.undefined;
      });

      it('should return false when not adding any dependents', () => {
        expect(
          showPensionBackupPath({
            veteranInformation: { isInReceiptOfPension: -1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: false, remove: true },
            'view:addDependentOptions': { addSpouse: false, report674: false },
          }),
        ).to.be.false;
      });
    });
  });
});

describe('show674IncomeQuestions', () => {
  describe('when feature flag - vaDependentsNetWorthAndPension - is off', () => {
    it('should return true', () => {
      expect(show674IncomeQuestions({ vaDependentsNetWorthAndPension: false }))
        .to.be.true;
    });

    it('should return true with undefined form data', () => {
      expect(show674IncomeQuestions()).to.be.true;
    });

    it('should return true with empty form data', () => {
      expect(show674IncomeQuestions({})).to.be.true;
    });
  });

  describe('when feature flag - vaDependentsNetWorthAndPension - is on', () => {
    describe('when veteran is in receipt of pension', () => {
      it('should return true when adding 674 and veteran has pension (isInReceiptOfPension = 1)', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true, addSpouse: false },
          }),
        ).to.be.true;
      });

      it('should return true when adding 674 and backup path indicates pension', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: -1 },
            'view:checkVeteranPension': true,
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true, addSpouse: false },
          }),
        ).to.be.true;
      });

      it('should return true when adding 674 along with other dependents and veteran has pension', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true, addSpouse: true },
          }),
        ).to.be.true;
      });
    });

    describe('when veteran is not in receipt of pension', () => {
      it('should return false when adding 674 but veteran not in receipt of pension (isInReceiptOfPension = 0)', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 0 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true, addSpouse: false },
          }),
        ).to.be.false;
      });

      it('should return false when adding 674 but backup path indicates no pension', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: -1 },
            'view:checkVeteranPension': false,
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true, addSpouse: false },
          }),
        ).to.be.false;
      });
    });

    describe('when not adding 674 dependents', () => {
      it('should return false when not adding 674 even if veteran has pension', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: false, addSpouse: true },
          }),
        ).to.be.false;
      });

      it('should return false when only adding non-674 dependents', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': {
              report674: false,
              addChild: true,
              addDisabledChild: true,
            },
          }),
        ).to.be.false;
      });
    });

    describe('when not adding any dependents', () => {
      it('should return false when not adding dependents at all', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: false, remove: true },
            'view:addDependentOptions': { report674: true },
          }),
        ).to.be.false;
      });
    });

    describe('edge cases', () => {
      it('should return false with empty form data when feature flag is on', () => {
        expect(show674IncomeQuestions({ vaDependentsNetWorthAndPension: true }))
          .to.be.undefined;
      });

      it('should return false when veteranInformation is missing', () => {
        expect(
          show674IncomeQuestions({
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
            'view:addDependentOptions': { report674: true },
          }),
        ).to.be.false;
      });

      it('should return false when addDependentOptions is missing', () => {
        expect(
          show674IncomeQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
            'view:addOrRemoveDependents': { add: true, remove: false },
          }),
        ).to.be.undefined;
      });
    });
  });
});

describe('showPensionRelatedQuestions', () => {
  describe('when feature flag - vaDependentsNetWorthAndPension - is off', () => {
    it('should return true', () => {
      expect(
        showPensionRelatedQuestions({ vaDependentsNetWorthAndPension: false }),
      ).to.be.true;
    });
  });

  describe('when feature flag - vaDependentsNetWorthAndPension - is on', () => {
    describe('when backup path is shown (no prefill data)', () => {
      describe('when adding dependents - not 674', () => {
        it('should return true if veteran has indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': true,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.true;
        });

        it('should return false if veteran has not indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': false,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.false;
        });
      });

      describe('when adding dependents - 674 only', () => {
        it('should return false if veteran has indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': true,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });

        it('should return false if veteran has not indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': false,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });
      });
    });

    describe('when backup path is not shown (has prefill data)', () => {
      describe('when adding dependents - not 674', () => {
        it('should return false if isInReceiptOfPension is 0', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: 0 },
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.false;
        });

        it('should return true if isInReceiptOfPension is 1', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: 1 },
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.true;
        });
      });

      describe('when adding dependents - 674 only', () => {
        it('should return false if veteran has indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': true,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });

        it('should return false if veteran has not indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': false,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });
      });
    });

    describe('when backup path is not shown (has prefill data)', () => {
      describe('when adding dependents - not 674', () => {
        it('should return false if isInReceiptOfPension is 0', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: 0 },
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.false;
        });

        it('should return true if isInReceiptOfPension is 1', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: 1 },
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: true, report674: false },
            }),
          ).to.be.true;
        });
      });

      describe('when adding dependents - 674 only', () => {
        it('should return false if veteran has indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': true,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });

        it('should return false if veteran has not indicated they are in receipt of pension', () => {
          expect(
            showPensionRelatedQuestions({
              veteranInformation: { isInReceiptOfPension: -1 },
              'view:checkVeteranPension': false,
              vaDependentsNetWorthAndPension: true,
              'view:addOrRemoveDependents': { add: true, remove: false },
              'view:addDependentOptions': { addSpouse: false, report674: true },
            }),
          ).to.be.false;
        });
      });
    });
  });
});

describe('buildSubmissionData', () => {
  const createTestData = (overrides = {}) => ({
    data: {
      'view:addOrRemoveDependents': { add: true, remove: true },
      'view:addDependentOptions': {
        addSpouse: false,
        addChild: false,
        report674: true,
        addDisabledChild: true,
      },
      'view:removeDependentOptions': {
        reportDivorce: true,
        reportDeath: true,
        reportStepchildNotInHousehold: true,
        reportMarriageOfChildUnder18: true,
        reportChild18OrOlderIsNotAttendingSchool: true,
      },
      currentMarriageInformation: { typeOfMarriage: 'CIVIL' },
      doesLiveWithSpouse: { spouseDoesLiveWithVeteran: true },
      spouseInformation: { fullName: { first: 'John', last: 'Doe' } },
      spouseSupportingDocuments: [{ name: 'doc.pdf' }],
      spouseMarriageHistory: [{ fullName: { first: 'Ex', last: 'Spouse' } }],
      veteranMarriageHistory: [{ fullName: { first: 'Ex', last: 'Spouse' } }],
      childrenToAdd: [{ fullName: { first: 'Child', last: 'Doe' } }],
      childSupportingDocuments: [{ name: 'child-doc.pdf' }],
      studentInformation: [{ fullName: { first: 'Student', last: 'Doe' } }],
      reportDivorce: { fullName: { first: 'Ex', last: 'Spouse' } },
      deaths: [{ fullName: { first: 'Deceased', last: 'Dependent' } }],
      stepChildren: [{ fullName: { first: 'Step', last: 'Child' } }],
      childMarriage: [{ fullName: { first: 'Married', last: 'Child' } }],
      childStoppedAttendingSchool: [
        { fullName: { first: 'School', last: 'Child' } },
      ],
      emptyArray: [],
      emptySpouseDocs: [],
      veteranInformation: { fullName: { first: 'Veteran', last: 'Name' } },
      veteranContactInformation: { phoneNumber: '555-1234' },
      statementOfTruthSignature: 'John Doe',
      statementOfTruthCertified: true,
      householdIncome: false,
      vaDependentsNetWorthAndPension: true,
      metadata: { version: 1 },
      ...overrides,
    },
  });

  it('should return unchanged payload when no data property exists', () => {
    const payload = { metadata: { version: 1 } };
    const result = buildSubmissionData(payload);
    expect(result).to.deep.equal(payload);
  });

  it('should always include core fields', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.useV2).to.be.true;
    expect(result.data.daysTillExpires).to.equal(365);
  });

  it('should include essential fields when present', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.veteranInformation).to.not.be.undefined;
    expect(result.data.veteranContactInformation).to.not.be.undefined;
    expect(result.data.statementOfTruthSignature).to.not.be.undefined;
    expect(result.data.statementOfTruthCertified).to.not.be.undefined;
    expect(result.data.metadata).to.not.be.undefined;
  });

  it('should handle boolean fields that can be false', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.householdIncome).to.equal(false);
    expect(result.data.vaDependentsNetWorthAndPension).to.be.true;
  });

  it('should not include spouse data when addSpouse is false', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.currentMarriageInformation).to.be.undefined;
    expect(result.data.doesLiveWithSpouse).to.be.undefined;
    expect(result.data.spouseInformation).to.be.undefined;
    expect(result.data.spouseSupportingDocuments).to.be.undefined;
    expect(result.data.spouseMarriageHistory).to.be.undefined;
    expect(result.data.veteranMarriageHistory).to.be.undefined;
  });

  it('should include spouse data when addSpouse is true', () => {
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: true,
        addChild: false,
        report674: true,
        addDisabledChild: true,
      },
    });
    const result = buildSubmissionData(payload);

    expect(result.data.currentMarriageInformation).to.not.be.undefined;
    expect(result.data.doesLiveWithSpouse).to.not.be.undefined;
    expect(result.data.spouseInformation).to.not.be.undefined;
    expect(result.data.spouseSupportingDocuments).to.not.be.undefined;
  });

  it('should include child data when either addChild or addDisabledChild is true', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.childrenToAdd).to.not.be.undefined;
    expect(result.data.childSupportingDocuments).to.not.be.undefined;
  });

  it('should not include child data when both addChild and addDisabledChild are false', () => {
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: false,
        addChild: false,
        report674: true,
        addDisabledChild: false,
      },
    });
    const result = buildSubmissionData(payload);

    expect(result.data.childrenToAdd).to.be.undefined;
    expect(result.data.childSupportingDocuments).to.be.undefined;
  });

  it('should include student data when report674 is true', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data.studentInformation).to.not.be.undefined;
  });

  it('should not include student data when report674 is false', () => {
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: false,
        addChild: false,
        report674: false,
        addDisabledChild: true,
      },
    });
    const result = buildSubmissionData(payload);

    expect(result.data.studentInformation).to.be.undefined;
  });

  it('should not include any add-related data when add is false', () => {
    const payload = createTestData({
      'view:addOrRemoveDependents': { add: false, remove: true },
    });
    const result = buildSubmissionData(payload);

    expect(result.data['view:addDependentOptions']).to.be.undefined;
    expect(result.data.currentMarriageInformation).to.be.undefined;
    expect(result.data.childrenToAdd).to.be.undefined;
    expect(result.data.studentInformation).to.be.undefined;
  });

  it('should not include any remove-related data when remove is false', () => {
    const payload = createTestData({
      'view:addOrRemoveDependents': { add: true, remove: false },
    });
    const result = buildSubmissionData(payload);

    expect(result.data['view:removeDependentOptions']).to.be.undefined;
    expect(result.data.reportDivorce).to.be.undefined;
    expect(result.data.deaths).to.be.undefined;
    expect(result.data.stepChildren).to.be.undefined;
    expect(result.data.childMarriage).to.be.undefined;
    expect(result.data.childStoppedAttendingSchool).to.be.undefined;
  });

  it('should build control objects with only enabled options', () => {
    const payload = createTestData();
    const result = buildSubmissionData(payload);

    expect(result.data['view:addDependentOptions']).to.deep.equal({
      report674: true,
      addDisabledChild: true,
    });

    expect(result.data['view:removeDependentOptions']).to.deep.equal({
      reportDivorce: true,
      reportDeath: true,
      reportStepchildNotInHousehold: true,
      reportMarriageOfChildUnder18: true,
      reportChild18OrOlderIsNotAttendingSchool: true,
    });

    expect(result.data['view:selectable686Options']).to.deep.equal({
      report674: true,
      addDisabledChild: true,
      reportDivorce: true,
      reportDeath: true,
      reportStepchildNotInHousehold: true,
      reportMarriageOfChildUnder18: true,
      reportChild18OrOlderIsNotAttendingSchool: true,
    });
  });

  it('should not include empty arrays', () => {
    const payload = createTestData({
      childrenToAdd: [],
      spouseSupportingDocuments: [],
    });
    const result = buildSubmissionData(payload);

    expect(result.data.childrenToAdd).to.be.undefined;
    expect(result.data.spouseSupportingDocuments).to.be.undefined;
  });

  it('should not include view:addOrRemoveDependents when no valid options remain', () => {
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: false,
        addChild: false,
        report674: false,
        addDisabledChild: false,
      },
      'view:addOrRemoveDependents': { add: true, remove: false },
    });
    const result = buildSubmissionData(payload);

    expect(result.data['view:addOrRemoveDependents']).to.be.undefined;
  });

  it('should handle complex mixed scenarios', () => {
    const payload = createTestData({
      'view:addDependentOptions': {
        addSpouse: true,
        addChild: false,
        report674: false,
        addDisabledChild: false,
      },
      'view:removeDependentOptions': {
        reportDivorce: true,
        reportDeath: false,
        reportStepchildNotInHousehold: false,
        reportMarriageOfChildUnder18: false,
        reportChild18OrOlderIsNotAttendingSchool: false,
      },
    });
    const result = buildSubmissionData(payload);

    expect(result.data.spouseInformation).to.not.be.undefined;

    expect(result.data.childrenToAdd).to.be.undefined;
    expect(result.data.studentInformation).to.be.undefined;

    expect(result.data.reportDivorce).to.not.be.undefined;
    expect(result.data.deaths).to.be.undefined;
    expect(result.data.stepChildren).to.be.undefined;

    expect(result.data['view:addDependentOptions']).to.deep.equal({
      addSpouse: true,
    });
    expect(result.data['view:removeDependentOptions']).to.deep.equal({
      reportDivorce: true,
    });
  });
});
