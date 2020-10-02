import { expect } from 'chai';
import getBenefitString from '../../../src/js/utilities/benefit-description';

describe('getBenefitString', () => {
  it('should throw an error for a missing benefitDescription', () => {
    expect(() => getBenefitString({ formId: '123' })).to.throw();
  });
  it('should throw an error for a missing benefitDescription.benefitType', () => {
    expect(() =>
      getBenefitString({ formId: '123', benefitDescription: {} }),
    ).to.throw();
  });
  it('should throw an error for a non-string benefitDescription.benefitType', () => {
    expect(() =>
      getBenefitString({
        formId: '123',
        benefitDescription: { benefitType: 123 },
      }),
    ).to.throw();
  });
  it('should throw an error for a truthy, non-string benefitDescription.subText', () => {
    expect(() =>
      getBenefitString({
        formId: '123',
        benefitDescription: {
          benefitType: 'health care benefits',
          subText: true,
        },
      }),
    ).to.throw();
  });
  it('should return a string with subtext', () => {
    const result = getBenefitString({
      formId: '123',
      benefitDescription: {
        benefitType: 'health care benefits',
        subText: '10-10EZ',
      },
    });
    expect(result).to.equal('health care benefits (10-10EZ)');
  });
  it('should return a string with formId as the subtext', () => {
    const result = getBenefitString({
      formId: '123',
      benefitDescription: {
        benefitType: 'health care benefits',
      },
    });
    expect(result).to.equal('health care benefits (123)');
  });
  it('should return a string without subtext', () => {
    const result = getBenefitString({
      formId: '123',
      benefitDescription: {
        benefitType: 'health care benefits',
        subText: false,
      },
    });
    expect(result).to.equal('health care benefits');
  });
});
