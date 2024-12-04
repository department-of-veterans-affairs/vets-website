import { expect } from 'chai';
import { getInsuranceAriaLabel } from '../../../../utils/helpers';

describe('hca `getInsuranceAriaLabel` method', () => {
  it('should return a generic label when the provider name is not provided', () => {
    const formData = {};
    expect(getInsuranceAriaLabel(formData)).to.equal('insurance policy');
  });

  it('should return the provider name & policy number when the policy number is provided', () => {
    const formData = {
      insuranceName: 'Aetna',
      insurancePolicyNumber: '005588',
    };
    expect(getInsuranceAriaLabel(formData)).to.equal(
      'Aetna, Policy number 005588',
    );
  });

  it('should return the provider name & group code when the group code is provided', () => {
    const formData = {
      insuranceName: 'Aetna',
      insuranceGroupCode: '005588',
    };
    expect(getInsuranceAriaLabel(formData)).to.equal(
      'Aetna, Group code 005588',
    );
  });
});
