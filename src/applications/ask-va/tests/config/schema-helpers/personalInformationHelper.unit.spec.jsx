import { expect } from 'chai';
import { mount } from 'enzyme';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import sinon from 'sinon';

import {
  aboutYourselfGeneralSchema,
  aboutYourselfGeneralUISchema,
  personalInformationAboutYourselfUiSchemas,
  personalInformationFormSchemas,
  validateSSandSNGroup,
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

    it('should have correct schema for social or service number group', () => {
      const schema = personalInformationFormSchemas.socialOrServiceNum;
      expect(schema).to.have.property('type', 'object');
      expect(schema.properties).to.have.property('ssn');
      expect(schema.properties).to.have.property('serviceNumber');
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

    it('should have correct hideIf logic for socialOrServiceNum', () => {
      const uiSchema =
        personalInformationAboutYourselfUiSchemas.socialOrServiceNum;
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
    });
  });

  describe('aboutYourselfGeneralUISchema', () => {
    it('should render VaTextInputField for first name with uswds option', () => {
      const uiSchema = aboutYourselfGeneralUISchema.first;
      expect(uiSchema['ui:webComponentField']).to.equal(VaTextInputField);
      expect(uiSchema['ui:options'].uswds).to.be.true;
    });
  });

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
        'Provide one of the following:',
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
});
