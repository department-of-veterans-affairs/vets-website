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
  showPensionBackupPath,
  showPensionRelatedQuestions,
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

describe('showPensionBackupPath', () => {
  describe('when feature flag - vaDependentsNetWorthAndPension - is off', () => {
    it('should return false', () => {
      expect(showPensionBackupPath({ vaDependentsNetWorthAndPension: false }))
        .to.be.false;
    });
  });

  describe('when feature flag - vaDependentsNetWorthAndPension - is on', () => {
    it('should return true if isInReceiptOfPension is -1', () => {
      expect(
        showPensionBackupPath({
          veteranInformation: { isInReceiptOfPension: -1 },
          vaDependentsNetWorthAndPension: true,
        }),
      ).to.be.true;
    });

    it('should return false if isInReceiptOfPension is not -1', () => {
      expect(
        showPensionBackupPath({
          veteranInformation: { isInReceiptOfPension: 1 },
          vaDependentsNetWorthAndPension: true,
        }),
      ).to.be.false;
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
      it('should return true if veteran has indicated they are in receipt of pension', () => {
        expect(
          showPensionRelatedQuestions({
            veteranInformation: { isInReceiptOfPension: -1 },
            'view:checkVeteranPension': true,
            vaDependentsNetWorthAndPension: true,
          }),
        ).to.be.true;
      });

      it('should return false if veteran has not indicated they are in receipt of pension', () => {
        expect(
          showPensionRelatedQuestions({
            veteranInformation: { isInReceiptOfPension: -1 },
            'view:checkVeteranPension': false,
            vaDependentsNetWorthAndPension: true,
          }),
        ).to.be.false;
      });
    });

    describe('when backup path is not shown (has prefill data)', () => {
      it('should return false if isInReceiptOfPension is 0', () => {
        expect(
          showPensionRelatedQuestions({
            veteranInformation: { isInReceiptOfPension: 0 },
            vaDependentsNetWorthAndPension: true,
          }),
        ).to.be.false;
      });

      it('should return true if isInReceiptOfPension is 1', () => {
        expect(
          showPensionRelatedQuestions({
            veteranInformation: { isInReceiptOfPension: 1 },
            vaDependentsNetWorthAndPension: true,
          }),
        ).to.be.true;
      });
    });
  });
});
