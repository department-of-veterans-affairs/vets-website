import { expect } from 'chai';

import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import {
  aboutYourselfGeneralSchema,
  aboutYourselfGeneralUISchema,
  personalInformationAboutYourselfUiSchemas,
  personalInformationFormSchemas,
} from '../../../config/schema-helpers/personalInformationHelper';

describe('Personal Information Form Schemas', () => {
  describe('personalInformationFormSchemas', () => {
    it('should have correct schema for first name', () => {
      const schema = personalInformationFormSchemas.first;
      expect(schema).to.have.property('type', 'string');
      expect(schema).to.have.property('pattern', '^[^0-9]*$');
      expect(schema).to.have.property('maxLength', 30);
    });

    it('should have correct schema for suffix with select schema', () => {
      const schema = personalInformationFormSchemas.suffix;
      expect(schema).to.have.property('type', 'string');
      expect(schema.enum).to.include.members(['Jr.', 'Sr.', 'II', 'III', 'IV']);
    });

    it('should have correct schema for date of birth', () => {
      const schema = personalInformationFormSchemas.dateOfBirth;
      expect(schema).to.have.property('type', 'string');
    });
  });

  describe('aboutYourselfGeneralSchema', () => {
    it('should have correct schema for general information fields', () => {
      const schema = aboutYourselfGeneralSchema.first;
      expect(schema).to.have.property('type', 'string');
      expect(schema).to.have.property('pattern', '^[^0-9]*$');
      expect(schema).to.have.property('maxLength', 30);
    });
  });
});

describe('Personal Information UI Schemas', () => {
  describe('personalInformationAboutYourselfUiSchemas', () => {
    it('should render VaTextInputField for first name with uswds option', () => {
      const uiSchema = personalInformationAboutYourselfUiSchemas.first;
      expect(uiSchema['ui:webComponentField']).to.equal(VaTextInputField);
      expect(uiSchema['ui:options'].uswds).to.be.true;
    });

    it('should have correct required logic for dateOfBirth', () => {
      const uiSchema = personalInformationAboutYourselfUiSchemas.dateOfBirth;
      const requiredFn = uiSchema['ui:required'];

      // Test case 1: Should be required for personal questions
      expect(
        requiredFn({
          whoIsYourQuestionAbout: 'Myself',
        }),
      ).to.be.true;

      // Test case 2: Should not be required for general questions
      expect(
        requiredFn({
          whoIsYourQuestionAbout: "It's a general question",
        }),
      ).to.be.false;
    });

    it('should have correct hideIf logic for dateOfBirth', () => {
      const uiSchema = personalInformationAboutYourselfUiSchemas.dateOfBirth;
      const hideIfFn = uiSchema['ui:options'].hideIf;

      // Test case 1: Should hide for general questions
      expect(
        hideIfFn({
          whoIsYourQuestionAbout: "It's a general question",
        }),
      ).to.be.true;

      // Test case 2: Should show for personal questions
      expect(
        hideIfFn({
          whoIsYourQuestionAbout: 'Myself',
        }),
      ).to.be.false;
    });

    it('should hide branch of service when not required', () => {
      const uiSchema =
        personalInformationAboutYourselfUiSchemas.branchOfService;
      const hideIfFn = uiSchema['ui:options'].hideIf;

      expect(
        hideIfFn({
          whoIsYourQuestionAbout: "It's a general question",
        }),
      ).to.be.true;
    });
  });

  describe('aboutYourselfGeneralUISchema', () => {
    it('should render VaTextInputField for first name with uswds option', () => {
      const uiSchema = aboutYourselfGeneralUISchema.first;
      expect(uiSchema['ui:webComponentField']).to.equal(VaTextInputField);
      expect(uiSchema['ui:options'].uswds).to.be.true;
    });
  });
});
