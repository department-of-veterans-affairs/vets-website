import { expect } from 'chai';
import { uiSchema as selfUiSchema } from '../../config/pages/nonVeteranApplicantDetails';
import { uiSchema as preparerUiSchema } from '../../config/pages/nonVeteranApplicantDetailsPreparer';
import {
  nonVeteranApplicantDetailsSubHeader,
  nonVeteranApplicantDetailsDescription,
  nonPreparerFullMaidenNameUI,
  ssnDashesUI,
  nonPreparerDateOfBirthUI,
} from '../../utils/helpers';

const runUiSchemaTests = (schemaFn, description) => {
  describe(`${description} uiSchema function`, () => {
    it('should use default parameters when no arguments are provided', () => {
      const result = schemaFn();

      expect(result.application['ui:title']).to.equal(
        nonVeteranApplicantDetailsSubHeader,
      );
      expect(result.application['ui:description']).to.equal(
        nonVeteranApplicantDetailsDescription,
      );
      expect(result.application.claimant.name).to.equal(
        nonPreparerFullMaidenNameUI,
      );
      expect(result.application.claimant.ssn).to.equal(ssnDashesUI);
      expect(result.application.claimant.dateOfBirth).to.equal(
        nonPreparerDateOfBirthUI,
      );
    });

    it('should override defaults when parameters are provided', () => {
      const customSubHeader = 'Custom Subheader';
      const customDescription = 'Custom Description';
      const customNameUI = { 'ui:title': 'Custom Name' };
      const customSSNUI = { 'ui:title': 'Custom SSN' };
      const customDOBUI = { 'ui:title': 'Custom DOB' };

      const result = schemaFn(
        customSubHeader,
        customDescription,
        customNameUI,
        customSSNUI,
        customDOBUI,
      );

      expect(result.application['ui:title']).to.equal(customSubHeader);
      expect(result.application['ui:description']).to.equal(customDescription);
      expect(result.application.claimant.name).to.equal(customNameUI);
      expect(result.application.claimant.ssn).to.equal(customSSNUI);
      expect(result.application.claimant.dateOfBirth).to.equal(customDOBUI);
    });
  });
};

runUiSchemaTests(selfUiSchema, 'self non-veteran');
runUiSchemaTests(preparerUiSchema, 'preparer non-veteran');
