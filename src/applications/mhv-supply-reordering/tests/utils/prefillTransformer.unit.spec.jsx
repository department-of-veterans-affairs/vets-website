import { expect } from 'chai';
import prefillTransformer from '../../utils/prefillTransformer';
import data from '../fixtures/mocks/ipf_mdot_get.json';

describe('prefillTransformer', () => {
  const transformedData = {
    permanentAddress: {
      country: 'USA',
      street: '101 EXAMPLE STREET',
      street2: 'APT 2',
      city: 'KANSAS CITY',
      state: 'MO',
      postalCode: '64117',
      isMilitary: false,
    },
    temporaryAddress: {
      street: 'PSC 1234 BOX 12345',
      street2: undefined,
      city: 'APO',
      state: 'AE',
      country: 'USA',
      postalCode: '09324',
      isMilitary: true,
    },
    emailAddress: 'vets.gov.user+1@gmail.com',
  };

  it('transforms DLC data into forms library data', () => {
    const result = prefillTransformer({}, data.formData, {});
    expect(result.formData.emailAddress).to.deep.equal(
      transformedData.emailAddress,
    );
    expect(result.formData.permanentAddress).to.deep.equal(
      transformedData.permanentAddress,
    );
    expect(result.formData.eligibility).to.deep.equal(
      result.formData.eligibility,
    );
    expect(result.formData.supplies).to.deep.equal(result.formData.supplies);
  });

  it('prefills undefined permanent address with temporary address value', () => {
    const result = prefillTransformer(
      {},
      { ...data.formData, permanentAddress: {} },
      {},
    );
    expect(result.formData.emailAddress).to.deep.equal(
      transformedData.emailAddress,
    );
    expect(result.formData.permanentAddress).to.deep.equal(
      transformedData.temporaryAddress,
    );
    expect(result.formData.eligibility).to.deep.equal(
      result.formData.eligibility,
    );
    expect(result.formData.supplies).to.deep.equal(result.formData.supplies);
  });
});
