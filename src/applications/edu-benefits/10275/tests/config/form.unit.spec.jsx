import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-10297 formConfig', () => {
  it('exports an object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('has the correct rootUrl', () => {
    expect(formConfig.rootUrl).to.equal(manifest.rootUrl);
  });
});

describe('22-10275 formConfig – agreementType page', () => {
  const page = formConfig.chapters.agreementTypeChapter.pages.agreementType;

  it('is wired with required fields', () => {
    expect(page.path).to.equal('agreement-type');
    expect(page.title).to.equal('Agreement type');
    expect(page.uiSchema).to.be.an('object');
    expect(page.schema).to.be.an('object');
    expect(page.onContinue).to.be.a('function');
  });

  it('onContinue clears facility-related fields when facilityCode is present (after trim)', () => {
    const data = {
      agreementType: 'newCommitment',
      institutionDetails: {
        facilityCode: ' 12345678 ', // note spaces to exercise trim()
        institutionName: 'Old Name',
        institutionAddress: { street: 'Old St' },
        poeEligible: true,
        extraField: 'keep-me',
      },
      somethingElse: 'preserve',
    };

    const setFormData = sinon.spy();
    page.onContinue(data, setFormData);

    expect(setFormData.calledOnce).to.be.true;
    const updated = setFormData.firstCall.args[0];

    expect(updated).to.deep.equal({
      ...data,
      institutionDetails: {
        ...data.institutionDetails,
        facilityCode: '',
        institutionName: undefined,
        institutionAddress: {},
        poeEligible: undefined,
      },
    });

    // sanity: untouched fields are preserved
    expect(updated.somethingElse).to.equal('preserve');
    expect(updated.institutionDetails.extraField).to.equal('keep-me');
  });

  it('onContinue does nothing when facilityCode is missing or blank', () => {
    const cases = [
      {}, // no institutionDetails
      { institutionDetails: {} }, // no facilityCode
      { institutionDetails: { facilityCode: '' } }, // empty
      { institutionDetails: { facilityCode: '   ' } }, // whitespace
    ];

    cases.forEach(payload => {
      const setFormData = sinon.spy();
      page.onContinue(payload, setFormData);
      expect(setFormData.called).to.be.false;
    });
  });
});

describe('22-10275 formConfig – page visibility', () => {
  describe('newCommitmentChapter -> institutionDetailsFacilityNew', () => {
    const page =
      formConfig.chapters.newCommitmentChapter.pages
        .institutionDetailsFacilityNew;

    it('is wired with required fields', () => {
      expect(page.path).to.equal('new-commitment-institution-details');
      expect(page.title).to.equal('Institution details');
      expect(page.uiSchema).to.be.an('object');
      expect(page.schema).to.be.an('object');
      expect(page.depends).to.be.a('function');
    });

    it('depends only on agreementType === "newCommitment"', () => {
      expect(page.depends({ agreementType: 'newCommitment' })).to.be.true;
      expect(page.depends({ agreementType: 'withdrawal' })).to.be.false;
      expect(page.depends({})).to.be.false;
      expect(page.depends(undefined)).to.be.false;
    });
  });

  describe('withdrawalChapter -> institutionDetailsFacilityWithdrawal', () => {
    const page =
      formConfig.chapters.withdrawalChapter.pages
        .institutionDetailsFacilityWithdrawal;

    it('is wired with required fields', () => {
      expect(page.path).to.equal('withdrawal-institution-details');
      expect(page.title).to.equal('Institution details');
      expect(page.uiSchema).to.be.an('object');
      expect(page.schema).to.be.an('object');
      expect(page.depends).to.be.a('function');
    });

    it('depends only on agreementType === "withdrawal"', () => {
      expect(page.depends({ agreementType: 'withdrawal' })).to.be.true;
      expect(page.depends({ agreementType: 'newCommitment' })).to.be.false;
      expect(page.depends({})).to.be.false;
      expect(page.depends(undefined)).to.be.false;
    });
  });

  describe('authorizedOfficialChapter -> authorizedOfficial', () => {
    const page =
      formConfig.chapters.authorizedOfficialChapter.pages.authorizedOfficial;

    it('is wired with required fields', () => {
      expect(page.path).to.equal('authorizing-official');
      expect(page.title).to.equal('Authorizing official');
      expect(page.uiSchema).to.be.an('object');
      expect(page.schema).to.be.an('object');
      expect(page.depends).to.be.a('function');
    });

    it('depends only on agreementType === "withdrawal"', () => {
      expect(page.depends({ agreementType: 'withdrawal' })).to.be.true;
      expect(page.depends({ agreementType: 'newCommitment' })).to.be.false;
      expect(page.depends({})).to.be.false;
      expect(page.depends(undefined)).to.be.false;
    });
  });
});
