import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  selectSchema,
  serviceNumberSchema,
  serviceNumberUI,
  ssnSchema,
  ssnUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';

const suffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV'];

const branchesOfService = [
  'Army',
  'Navy',
  'Coast Guard',
  'Air Force',
  'Marine Corps',
];

const ssnServiceInfo = (
  <>
    <h4 className="vads-u-font-weight--bold vads-u-font-family--serif">
      Social Security or service number
    </h4>
    <span className="vads-u-margin-y--0">
      Please provide one of the following:
    </span>
  </>
);

const validateGroup = (errors, values) => {
  if (!Object.keys(values).some(key => values[key])) {
    errors.addError(`Please provide an answer`);
  }
};

export const personalInformationFormSchemas = {
  first: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  middle: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  last: { type: 'string', pattern: '^[A-Za-z]+$', minLength: 1, maxLength: 25 },
  suffix: selectSchema(suffixes),
  socialOrServiceNum: {
    type: 'object',
    properties: {
      ssn: ssnSchema,
      serviceNumber: serviceNumberSchema,
    },
    required: ['ssn'],
  },
  socialNum: ssnSchema,
  dateOfBirth: dateOfBirthSchema,
  branchOfService: selectSchema(branchesOfService),
};

export const aboutYourselfRelationshipFamilyMemberSchema = {
  first: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  middle: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  last: { type: 'string', pattern: '^[A-Za-z]+$', minLength: 1, maxLength: 25 },
  suffix: selectSchema(suffixes),
  socialNum: ssnSchema,
  dateOfBirth: dateOfBirthSchema,
  branchOfService: selectSchema(branchesOfService),
};

export const aboutYourselfGeneralSchema = {
  first: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  middle: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  last: { type: 'string', pattern: '^[A-Za-z]+$', minLength: 1, maxLength: 25 },
  suffix: selectSchema(suffixes),
};

export const personalInformationUiSchemas = {
  first: {
    'ui:title': 'First name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'given-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a first name' },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'additional-name',
  },
  last: {
    'ui:title': 'Last name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'family-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a last name' },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:webComponentField': VaSelectField,
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium',
      hideEmptyValueInReview: true,
    },
  },
  socialOrServiceNum: {
    'ui:title': ssnServiceInfo,
    'ui:required': () => true,
    'ui:validations': [validateGroup],
    'ui:options': { showFieldLabel: true },
    ssn: ssnUI(),
    serviceNumber: serviceNumberUI('Service number'),
  },
  socialNum: {
    ...ssnUI(),
    'ui:required': () => false,
    'ui:options': {
      hideIf: () => true,
    },
  },
  dateOfBirth: { ...dateOfBirthUI(), 'ui:required': () => true },
  branchOfService: {
    'ui:title': 'Branch of service',
    'ui:webComponentField': VaSelectField,
    'ui:options': {
      hideIf: () => true,
    },
  },
};

export const personalInformationAboutYourselfUiSchemas = {
  first: {
    'ui:title': 'First name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'given-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a first name' },
    'ui:options': {
      uswds: true,
    },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'additional-name',
    'ui:options': {
      uswds: true,
    },
  },
  last: {
    'ui:title': 'Last name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'family-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a last name' },
    'ui:options': {
      uswds: true,
    },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:webComponentField': VaSelectField,
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      uswds: true,
      widgetClassNames: 'form-select-medium',
      hideEmptyValueInReview: true,
    },
  },
  socialOrServiceNum: {
    'ui:title': ssnServiceInfo,
    'ui:validations': [validateGroup],
    'ui:options': {
      uswds: true,
      showFieldLabel: true,
      hideIf: formData =>
        (formData.questionAbout === 'Someone else' &&
          formData.personalRelationship ===
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)") ||
        (formData.questionAbout === 'Someone else' &&
          formData.personalRelationship ===
            "I'm a family member of a Veteran") ||
        (formData.questionAbout === 'Myself' &&
          formData.personalRelationship ===
            "I'm a family member of a Veteran") ||
        formData.questionAbout === "It's a general question",
    },
    ssn: ssnUI(),
    serviceNumber: serviceNumberUI('Service number'),
  },
  socialNum: {
    ...ssnUI(),
    'ui:required': formData =>
      formData.questionAbout === 'Myself' &&
      formData.personalRelationship === "I'm a family member of a Veteran",
    'ui:options': {
      uswds: true,
      hideIf: formData =>
        !(
          formData.questionAbout === 'Myself' &&
          formData.personalRelationship === "I'm a family member of a Veteran"
        ),
    },
  },
  dateOfBirth: {
    ...dateOfBirthUI(),
    'ui:required': formData =>
      !(
        (formData.questionAbout === 'Someone else' &&
          formData.personalRelationship ===
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)") ||
        (formData.questionAbout === 'Someone else' &&
          formData.personalRelationship ===
            "I'm a family member of a Veteran") ||
        formData.questionAbout === "It's a general question"
      ),
    'ui:options': {
      uswds: true,
      hideIf: formData =>
        (formData.questionAbout === 'Someone else' &&
          formData.personalRelationship ===
            "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)") ||
        (formData.questionAbout === 'Someone else' &&
          formData.personalRelationship ===
            "I'm a family member of a Veteran") ||
        formData.questionAbout === "It's a general question",
    },
  },
  branchOfService: {
    'ui:title': 'Branch of service',
    'ui:webComponentField': VaSelectField,
    'ui:required': formData =>
      (formData.questionAbout === 'Myself' ||
        formData.questionAbout === 'Someone else') &&
      formData.personalRelationship === "I'm the Veteran" &&
      (formData.selectCategory === 'Veteran Identification Card (VIC)' ||
        formData.selectCategory === 'Survivor Benefits' ||
        formData.selectCategory === 'Burial & Memorial Benefits (NCA)' ||
        formData.selectCategory === "Women Veterans' issues" ||
        formData.selectCategory === 'Benefits Issues Outside the US'),
    'ui:options': {
      uswds: true,
      hideIf: formData =>
        !(
          (formData.questionAbout === 'Myself' ||
            formData.questionAbout === 'Someone else') &&
          formData.personalRelationship === "I'm the Veteran" &&
          (formData.selectCategory === 'Veteran Identification Card (VIC)' ||
            formData.selectCategory === 'Survivor Benefits' ||
            formData.selectCategory === 'Burial & Memorial Benefits (NCA)' ||
            formData.selectCategory === "Women Veterans' issues" ||
            formData.selectCategory === 'Benefits Issues Outside the US')
        ),
    },
  },
};

export const aboutYourselfGeneralUISchema = {
  first: {
    'ui:title': 'First name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'given-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a first name' },
    'ui:options': {
      uswds: true,
    },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'additional-name',
    'ui:options': {
      uswds: true,
    },
  },
  last: {
    'ui:title': 'Last name',
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'family-name',
    'ui:required': () => true,
    'ui:errorMessages': { required: 'Please enter a last name' },
    'ui:options': {
      uswds: true,
    },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:webComponentField': VaSelectField,
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      uswds: true,
      widgetClassNames: 'form-select-medium',
      hideEmptyValueInReview: true,
    },
  },
};
