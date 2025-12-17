import { expect } from 'chai';
import prefillTransformer from '../../../config/prefill-transformer';

describe('prefillTransformer', () => {
  const basePages = { page1: {}, page2: {} };
  const baseMetadata = { version: 0 };

  const makeState = loggedIn => ({
    user: {
      login: {
        currentlyLoggedIn: loggedIn,
      },
    },
  });

  it('passes through pages and metadata unchanged', () => {
    const result = prefillTransformer(
      basePages,
      {},
      baseMetadata,
      makeState(true),
    );

    expect(result.pages).to.equal(basePages);
    expect(result.metadata).to.equal(baseMetadata);
  });

  it('maps login status into formData.isLoggedIn', () => {
    expect(
      prefillTransformer(basePages, {}, baseMetadata, makeState(true)).formData
        .isLoggedIn,
    ).to.be.true;

    expect(
      prefillTransformer(basePages, {}, baseMetadata, makeState(false)).formData
        .isLoggedIn,
    ).to.be.false;
  });

  it('extracts email and claimant phone', () => {
    const formData = {
      email: 'test@example.com',
      phone: '555-1234',
    };

    const result = prefillTransformer(
      basePages,
      formData,
      baseMetadata,
      makeState(true),
    );

    expect(result.formData.email).to.equal('test@example.com');
    expect(result.formData.claimantPhone).to.equal('555-1234');
  });

  it('returns empty strings for missing email and phone', () => {
    const result = prefillTransformer(
      basePages,
      {},
      baseMetadata,
      makeState(true),
    );

    expect(result.formData.email).to.equal('');
    expect(result.formData.claimantPhone).to.equal('');
  });

  it('extracts SSN and VA file number from nonPrefill', () => {
    const formData = {
      nonPrefill: {
        veteranSocialSecurityNumber: '123456789',
        veteranVaFileNumber: '987654321',
      },
    };

    const result = prefillTransformer(
      basePages,
      formData,
      baseMetadata,
      makeState(true),
    );

    expect(result.formData.veteranSocialSecurityNumber).to.equal('123456789');
    expect(result.formData.veteranSsnLastFour).to.equal('6789');
    expect(result.formData.vaFileNumber).to.equal('987654321');
    expect(result.formData.vaFileNumberLastFour).to.equal('4321');
  });

  it('handles missing nonPrefill object', () => {
    const result = prefillTransformer(
      basePages,
      {},
      baseMetadata,
      makeState(true),
    );

    expect(result.formData.veteranSocialSecurityNumber).to.equal('');
    expect(result.formData.veteranSsnLastFour).to.equal('');
    expect(result.formData.vaFileNumber).to.equal('');
    expect(result.formData.vaFileNumberLastFour).to.equal('');
  });
});
