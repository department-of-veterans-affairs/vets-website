import { expect } from 'chai';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';

import {
  aboutYourselfGeneralSchema,
  aboutYourselfGeneralUISchema,
  personalInformationAboutYourselfUiSchemas,
  personalInformationFormSchemas,
  personalInformationUiSchemas,
} from '../../../config/schema-helpers/personalInformationHelper';

describe('Personal Information Form Schemas', () => {
  describe('personalInformationFormSchemas', () => {
    it('should have correct schema for first name', () => {
      const schema = personalInformationFormSchemas.first;
      expect(schema).to.have.property('type', 'string');
      expect(schema).to.have.property('pattern', '^[A-Za-z]+$');
      expect(schema).to.have.property('maxLength', 25);
    });

    it('should have correct schema for suffix with select schema', () => {
      const schema = personalInformationFormSchemas.suffix;
      expect(schema).to.have.property('type', 'string');
      expect(schema.enum).to.include.members(['Jr.', 'Sr.', 'II', 'III', 'IV']);
    });

    it('should have correct schema for social or service number group', () => {
      const schema = personalInformationFormSchemas.socialOrServiceNum;
      expect(schema).to.have.property('type', 'object');
      expect(schema.properties).to.have.property('ssn');
      expect(schema.properties).to.have.property('serviceNumber');
    });

    describe('personalInformationFormSchemas', () => {
      it('should have correct schema for date of birth', () => {
        const schema = personalInformationFormSchemas.dateOfBirth;
        expect(schema).to.have.property('type', 'string');
      });
    });
  });

  describe('aboutYourselfGeneralSchema', () => {
    it('should have correct schema for general information fields', () => {
      const schema = aboutYourselfGeneralSchema.first;
      expect(schema).to.have.property('type', 'string');
      expect(schema).to.have.property('pattern', '^[A-Za-z]+$');
      expect(schema).to.have.property('maxLength', 25);
    });
  });
});

describe('Personal Information UI Schemas', () => {
  describe('personalInformationUiSchemas', () => {
    it('should render VaTextInputField for first name', () => {
      const uiSchema = personalInformationUiSchemas.first;
      expect(uiSchema['ui:webComponentField']).to.equal(VaTextInputField);
      expect(uiSchema['ui:title']).to.equal('First name');
    });

    it('should render VaSelectField for suffix', () => {
      const uiSchema = personalInformationUiSchemas.suffix;
      expect(uiSchema['ui:webComponentField']).to.equal(VaSelectField);
      expect(uiSchema['ui:options'].widgetClassNames).to.equal(
        'form-select-medium',
      );
    });

    it('should have ssn UI with validation for socialOrServiceNum', () => {
      const uiSchema = personalInformationUiSchemas.socialOrServiceNum;
      expect(uiSchema['ui:title'].props.children[0].type).to.equal('p');
      expect(uiSchema['ui:validations'][0]).to.be.a('function');
    });
  });

  describe('personalInformationAboutYourselfUiSchemas', () => {
    it('should render VaTextInputField for first name with uswds option', () => {
      const uiSchema = personalInformationAboutYourselfUiSchemas.first;
      expect(uiSchema['ui:webComponentField']).to.equal(VaTextInputField);
      expect(uiSchema['ui:options'].uswds).to.be.true;
    });

    it('should have correct hideIf logic for socialOrServiceNum', () => {
      const uiSchema =
        personalInformationAboutYourselfUiSchemas.socialOrServiceNum;
      expect(uiSchema['ui:options'].hideIf).to.be.a('function');
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
