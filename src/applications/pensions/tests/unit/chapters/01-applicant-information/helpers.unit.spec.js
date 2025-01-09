import { expect } from 'chai';

import { fullNameUI } from 'platform/forms-system/src/js/web-component-patterns';
import { benefitsIntakeFullNameUI } from '../../../../config/chapters/01-applicant-information/helpers';

describe('Pensions applicant information helpers', () => {
  describe('benefitIntakeFullName', () => {
    it('should extend name validation', () => {
      const benefitsUiSchema = benefitsIntakeFullNameUI();
      const defaultUiSchema = fullNameUI();
      expect(Object.keys(benefitsUiSchema)).to.have.same.members(
        Object.keys(defaultUiSchema),
      );
      expect(benefitsUiSchema.first['ui:validations']).to.have.lengthOf(2);
      expect(benefitsUiSchema.last['ui:validations']).to.have.lengthOf(2);
    });
  });
});
