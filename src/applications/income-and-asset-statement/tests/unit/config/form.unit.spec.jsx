import { expect } from 'chai';

import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import PreSubmitInfo from '../../../containers/PreSubmitInfo';

import prefillTransformer from '../../../config/prefill-transformer';
import { submit } from '../../../config/submit';

describe('21P-0969 form config', () => {
  it('exports an object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('has required core properties', () => {
    expect(formConfig.rootUrl).to.be.a('string');
    expect(formConfig.rootUrl).to.equal(
      '/supporting-forms-for-claims/submit-income-and-asset-statement-form-21p-0969',
    );
    expect(formConfig.urlPrefix).to.equal('/');
    expect(formConfig.submitUrl).to.equal('form0969');
    expect(formConfig.trackingPrefix).to.equal('income-and-asset-statement-');
    expect(formConfig.formId).to.exist;
  });

  it('includes the correct introduction and confirmation pages', () => {
    expect(formConfig.introduction).to.equal(IntroductionPage);
    expect(formConfig.confirmation).to.equal(ConfirmationPage);
  });

  it('wires the submit function', () => {
    expect(formConfig.submit).to.equal(submit);
    expect(formConfig.submit).to.be.a('function');
  });

  it('wires the prefill transformer', () => {
    expect(formConfig.prefillTransformer).to.equal(prefillTransformer);
  });

  it('has preSubmitInfo configured correctly', () => {
    const psi = formConfig.preSubmitInfo;

    expect(psi).to.be.an('object');
    expect(psi.CustomComponent).to.equal(PreSubmitInfo);
    expect(psi.statementOfTruth).to.be.an('object');
    expect(psi.statementOfTruth.fullNamePath).to.be.a('function');

    const vLoggedIn = psi.statementOfTruth.fullNamePath({
      claimantType: 'VETERAN',
      isLoggedIn: true,
    });
    expect(vLoggedIn).to.equal('veteranFullName');

    const nonVet = psi.statementOfTruth.fullNamePath({
      claimantType: 'SPOUSE',
    });
    expect(nonVet).to.equal('claimantFullName');
  });

  it('declares all expected chapters', () => {
    const { chapters } = formConfig;

    expect(chapters).to.be.an('object');

    const expected = [
      'veteranAndClaimantInformation',
      'unassociatedIncomes',
      'associatedIncomes',
      'ownedAssets',
      'royaltiesAndOtherProperties',
      'assetTransfers',
      'trusts',
      'annuities',
      'unreportedAssets',
      'discontinuedIncomes',
      'incomeReceiptWaivers',
      'supportingDocuments',
    ];

    expected.forEach(ch => {
      expect(chapters[ch], `missing chapter: ${ch}`).to.exist;
    });
  });
});
