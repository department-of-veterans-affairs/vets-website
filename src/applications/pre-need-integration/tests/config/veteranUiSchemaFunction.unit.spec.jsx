import { expect } from 'chai';
import { uiSchema as veteranSelfUiSchema } from '../../config/pages/veteranApplicantDetails';
import { uiSchema as veteranPreparerUiSchema } from '../../config/pages/veteranApplicantDetailsPreparer';
import {
  veteranApplicantDetailsSubHeader,
  nonPreparerFullMaidenNameUI,
  nonPreparerDateOfBirthUI,
  ssnDashesUI,
  applicantDetailsCityTitle,
  applicantDetailsStateTitle,
} from '../../utils/helpers';

const runVeteranUiSchemaTests = (
  schemaFn,
  description,
  hasTopLevelTitle = false,
) => {
  describe(`${description} uiSchema function`, () => {
    it('should use default parameters when no arguments are provided', () => {
      const result = schemaFn();

      if (hasTopLevelTitle) {
        expect(result['ui:title']).to.be.a('function');
      }
      expect(result.application['ui:title']).to.equal(
        veteranApplicantDetailsSubHeader,
      );
      expect(
        result.application.claimant['view:applicantDetailsDescription'][
          'ui:description'
        ],
      ).to.equal('');
      expect(result.application.claimant.name).to.equal(
        nonPreparerFullMaidenNameUI,
      );
      expect(result.application.claimant.ssn).to.equal(ssnDashesUI);
      expect(result.application.claimant.dateOfBirth).to.equal(
        nonPreparerDateOfBirthUI,
      );
      expect(result.application.veteran.cityOfBirth['ui:title']).to.equal(
        applicantDetailsCityTitle,
      );
      expect(result.application.veteran.stateOfBirth['ui:title']).to.equal(
        applicantDetailsStateTitle,
      );
    });

    it('should override defaults when parameters are provided', () => {
      const customSubHeader = 'Custom Veteran Subheader';
      const customDescription = 'Custom Veteran Description';
      const customNameUI = { 'ui:title': 'Custom Veteran Name' };
      const customSSNUI = { 'ui:title': 'Custom Veteran SSN' };
      const customDOBUI = { 'ui:title': 'Custom Veteran DOB' };
      const customCityTitle = 'Custom City Title';
      const customStateTitle = 'Custom State Title';

      const result = schemaFn(
        customSubHeader,
        customDescription,
        customNameUI,
        customSSNUI,
        customDOBUI,
        customCityTitle,
        customStateTitle,
      );

      expect(result.application['ui:title']).to.equal(customSubHeader);
      expect(
        result.application.claimant['view:applicantDetailsDescription'][
          'ui:description'
        ],
      ).to.equal(customDescription);
      expect(result.application.claimant.name).to.equal(customNameUI);
      expect(result.application.claimant.ssn).to.equal(customSSNUI);
      expect(result.application.claimant.dateOfBirth).to.equal(customDOBUI);
      expect(result.application.veteran.cityOfBirth['ui:title']).to.equal(
        customCityTitle,
      );
      expect(result.application.veteran.stateOfBirth['ui:title']).to.equal(
        customStateTitle,
      );
    });
  });
};

runVeteranUiSchemaTests(veteranSelfUiSchema, 'veteran self', true);
runVeteranUiSchemaTests(veteranPreparerUiSchema, 'veteran preparer');
