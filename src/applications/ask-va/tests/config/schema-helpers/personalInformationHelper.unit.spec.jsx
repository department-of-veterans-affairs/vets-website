import { expect } from 'chai';
<<<<<<< HEAD
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';
=======
import { mount } from 'enzyme';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import sinon from 'sinon';
>>>>>>> main

import {
  aboutYourselfGeneralSchema,
  aboutYourselfGeneralUISchema,
  personalInformationAboutYourselfUiSchemas,
  personalInformationFormSchemas,
<<<<<<< HEAD
  personalInformationUiSchemas,
=======
  validateSSandSNGroup,
>>>>>>> main
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

<<<<<<< HEAD
    describe('personalInformationFormSchemas', () => {
      it('should have correct schema for date of birth', () => {
        const schema = personalInformationFormSchemas.dateOfBirth;
        expect(schema).to.have.property('type', 'string');
      });
=======
    it('should have correct schema for date of birth', () => {
      const schema = personalInformationFormSchemas.dateOfBirth;
      expect(schema).to.have.property('type', 'string');
>>>>>>> main
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
<<<<<<< HEAD
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

=======
>>>>>>> main
  describe('personalInformationAboutYourselfUiSchemas', () => {
    it('should render VaTextInputField for first name with uswds option', () => {
      const uiSchema = personalInformationAboutYourselfUiSchemas.first;
      expect(uiSchema['ui:webComponentField']).to.equal(VaTextInputField);
      expect(uiSchema['ui:options'].uswds).to.be.true;
    });

    it('should have correct hideIf logic for socialOrServiceNum', () => {
      const uiSchema =
        personalInformationAboutYourselfUiSchemas.socialOrServiceNum;
<<<<<<< HEAD
      expect(uiSchema['ui:options'].hideIf).to.be.a('function');
=======
      const hideIfFn = uiSchema['ui:options'].hideIf;

      // Test case 1: Should hide for general questions
      expect(
        hideIfFn({
          whoIsYourQuestionAbout: "It's a general question",
        }),
      ).to.be.true;

      // Test case 2: Should hide for family members
      expect(
        hideIfFn({
          whoIsYourQuestionAbout: 'Someone else',
          relationshipToVeteran: "I'm a family member of a Veteran",
        }),
      ).to.be.true;

      // Test case 3: Should show for personal questions
      expect(
        hideIfFn({
          whoIsYourQuestionAbout: 'Myself',
        }),
      ).to.be.false;
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
>>>>>>> main
    });
  });

  describe('aboutYourselfGeneralUISchema', () => {
    it('should render VaTextInputField for first name with uswds option', () => {
      const uiSchema = aboutYourselfGeneralUISchema.first;
      expect(uiSchema['ui:webComponentField']).to.equal(VaTextInputField);
      expect(uiSchema['ui:options'].uswds).to.be.true;
    });
  });
<<<<<<< HEAD
=======

  describe('ssnServiceInfo React Component', () => {
    let wrapper;

    it('should render correctly', () => {
      const uiSchema =
        personalInformationAboutYourselfUiSchemas.socialOrServiceNum;
      wrapper = mount(uiSchema['ui:title']);

      expect(wrapper.find('.vads-u-margin-bottom--neg2p5')).to.have.lengthOf(1);
      expect(wrapper.find('.vads-u-font-weight--bold').text()).to.equal(
        'Social Security or service number',
      );
      expect(wrapper.find('.form-required-span').text()).to.equal(
        '(*Required)',
      );
      expect(wrapper.find('.vads-u-margin-y--0').text()).to.equal(
        'Please provide one of the following:',
      );
      wrapper.unmount();
    });
  });
});

describe('validateSSandSNGroup', () => {
  let sandbox;
  let errors;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    errors = { addError: sandbox.spy() };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should require SSN/Service number for non-general questions', () => {
    validateSSandSNGroup(
      errors,
      {},
      {
        whoIsYourQuestionAbout: 'Myself',
      },
    );
    expect(errors.addError.calledOnce).to.be.true;
  });

  it('should not require SSN/Service number for general questions', () => {
    validateSSandSNGroup(
      errors,
      {},
      {
        whoIsYourQuestionAbout: "It's a general question",
      },
    );
    expect(errors.addError.called).to.be.false;
  });

  it('should not require SSN/Service number for connected through work', () => {
    validateSSandSNGroup(
      errors,
      {},
      {
        whoIsYourQuestionAbout: 'Someone else',
        relationshipToVeteran:
          "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)",
      },
    );
    expect(errors.addError.called).to.be.false;
  });

  it('should accept either SSN or service number when provided', () => {
    validateSSandSNGroup(
      errors,
      { ssn: '123-45-6789' },
      {
        whoIsYourQuestionAbout: 'Myself',
      },
    );
    expect(errors.addError.called).to.be.false;

    validateSSandSNGroup(
      errors,
      { serviceNumber: '12345678' },
      {
        whoIsYourQuestionAbout: 'Myself',
      },
    );
    expect(errors.addError.called).to.be.false;
  });
>>>>>>> main
});
