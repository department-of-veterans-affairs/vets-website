import { expect } from 'chai';
import { getInsuranceAriaLabel } from '../../../../utils/helpers';

describe('hca `getInsuranceAriaLabel` method', () => {
  const testCases = [
    {
      description:
        'should return a generic label when the provider name is not provided',
      input: Object.freeze({}),
      expected: 'insurance policy',
    },
    {
      description:
        'should return the provider name & policy number when the policy number is provided',
      input: Object.freeze({
        insuranceName: 'Aetna',
        insurancePolicyNumber: '005588',
      }),
      expected: 'Aetna, Policy number 005588',
    },
    {
      description:
        'should return the provider name & group code when the group code is provided',
      input: Object.freeze({
        insuranceName: 'Aetna',
        insuranceGroupCode: '005588',
      }),
      expected: 'Aetna, Group code 005588',
    },
  ];

  testCases.forEach(({ description, input, expected }) => {
    it(description, () => expect(getInsuranceAriaLabel(input)).to.eq(expected));
  });
});
