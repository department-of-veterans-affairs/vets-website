import { expect } from 'chai';
import getFormDescription from '../../../src/js/utilities/form-description';

describe('getFormDescription', () => {
  describe('error handling', () => {
    it('should throw an error for a missing benefitDescription', () => {
      expect(() => getFormDescription({ formId: '123' })).to.throw();
    });
    it('should throw an error for a missing benefitDescription.benefitType', () => {
      expect(() =>
        getFormDescription({ formId: '123', benefitDescription: {} }),
      ).to.throw();
    });
    it('should throw an error for a non-string benefitDescription.benefitType', () => {
      expect(() =>
        getFormDescription({
          formId: '123',
          benefitDescription: { benefitType: 123 },
        }),
      ).to.throw();
    });
    it('should throw an error for a non-string customText.savedFormDescription', () => {
      expect(() =>
        getFormDescription({
          formId: '123',
          benefitDescription: { benefitType: '123' },
          customText: { savedFormDescription: 123 },
        }),
      ).to.throw();
    });
    it('should throw an error for a truthy, non-string benefitDescription.subText', () => {
      expect(() =>
        getFormDescription({
          formId: '123',
          benefitDescription: {
            benefitType: 'health care benefits',
            subText: true,
          },
        }),
      ).to.throw();
    });
  });

  describe('functionality', () => {
    it('should return a string with subtext', () => {
      const result = getFormDescription({
        formId: '123',
        benefitDescription: {
          benefitType: 'health care benefits',
          subText: '10-10EZ',
        },
      });
      expect(result).to.equal('health care benefits application (10-10EZ)');
    });
    it('should return a string with formId as the subtext', () => {
      const result = getFormDescription({
        formId: '123',
        benefitDescription: {
          benefitType: 'health care benefits',
        },
      });
      expect(result).to.equal('health care benefits application (123)');
    });
    it('should return a string without subtext', () => {
      const result = getFormDescription({
        formId: '123',
        benefitDescription: {
          benefitType: 'health care benefits',
          subText: false,
        },
      });
      expect(result).to.equal('health care benefits application');
    });
    it('should return the customText.savedFormDescription if available', () => {
      const result = getFormDescription({
        formId: '123',
        benefitDescription: {
          benefitType: 'health care benefits',
          subText: false,
        },
        customText: {
          savedFormDescription: 'overridden!',
        },
      });
      expect(result).to.equal('overridden!');
    });
  });
});
