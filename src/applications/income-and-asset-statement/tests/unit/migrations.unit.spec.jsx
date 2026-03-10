import { expect } from 'chai';

import migrations from '../../migrations';

describe('0969 migrations', () => {
  it('should not change returnUrl when discontinuedIncomes does not exist', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        claimantType: 'VETERAN',
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(formData).to.be.an('object');
    expect(metadata.returnUrl).to.equal('/original-url');
  });

  it('should not change returnUrl when discontinuedIncomes is empty', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        claimantType: 'VETERAN',
        discontinuedIncomes: [],
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(formData).to.be.an('object');
    expect(metadata.returnUrl).to.equal('/original-url');
  });

  it('should redirect to veteran summary when claimantType is VETERAN and discontinuedIncomes exists', () => {
    const { metadata } = migrations[0]({
      formData: {
        claimantType: 'VETERAN',
        discontinuedIncomes: [{ incomeType: 'some legacy text value' }],
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal('/discontinued-income-summary-veteran');
  });

  it('should redirect to spouse summary when claimantType is SPOUSE and discontinuedIncomes exists', () => {
    const { metadata } = migrations[0]({
      formData: {
        claimantType: 'SPOUSE',
        discontinuedIncomes: [{ incomeType: 'some legacy text value' }],
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal('/discontinued-income-summary-spouse');
  });

  it('should redirect to child summary when claimantType is CHILD and discontinuedIncomes exists', () => {
    const { metadata } = migrations[0]({
      formData: {
        claimantType: 'CHILD',
        discontinuedIncomes: [{ incomeType: 'some legacy text value' }],
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal('/discontinued-income-summary-child');
  });

  it('should redirect to parent summary when claimantType is PARENT and discontinuedIncomes exists', () => {
    const { metadata } = migrations[0]({
      formData: {
        claimantType: 'PARENT',
        discontinuedIncomes: [{ incomeType: 'some legacy text value' }],
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal('/discontinued-income-summary-parent');
  });

  it('should redirect to custodian summary when claimantType is CUSTODIAN and discontinuedIncomes exists', () => {
    const { metadata } = migrations[0]({
      formData: {
        claimantType: 'CUSTODIAN',
        discontinuedIncomes: [{ incomeType: 'some legacy text value' }],
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal(
      '/discontinued-income-summary-custodian',
    );
  });

  it('should default to veteran summary when claimantType is missing and discontinuedIncomes exists', () => {
    const { metadata } = migrations[0]({
      formData: {
        discontinuedIncomes: [{ incomeType: 'some legacy text value' }],
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal('/discontinued-income-summary-veteran');
  });

  it('should default to veteran summary when claimantType is unrecognized and discontinuedIncomes exists', () => {
    const { metadata } = migrations[0]({
      formData: {
        claimantType: 'NOT_A_REAL_TYPE',
        discontinuedIncomes: [{ incomeType: 'some legacy text value' }],
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal('/discontinued-income-summary-veteran');
  });
});
