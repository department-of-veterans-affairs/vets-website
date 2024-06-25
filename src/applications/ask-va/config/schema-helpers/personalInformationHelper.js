import { mapValues } from 'lodash';
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

export const createBooleanSchemaPropertiesFromOptions = obj =>
  mapValues(obj, () => {
    return { type: 'boolean' };
  });

export const createUiTitlePropertiesFromOptions = obj => {
  return Object.entries(obj).reduce((accumulator, [key, value]) => {
    accumulator[key] = { 'ui:title': value };
    return accumulator;
  }, {});
};

const suffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV'];

const branchesOfService = [
  'Army',
  'Navy',
  'Coast Guard',
  'Air Force',
  'Marine Corps',
];

const pronounInfo = (
  <>
    <h4 className="vads-u-font-weight--bold vads-u-font-family--serif vads-u-font-size--h6">
      Pronouns
    </h4>
    <p className="vads-u-color--gray-medium vads-u-margin-bottom--2">
      Share this information if you’d like to help us understand the best way to
      address you.
    </p>
    <span>Select all of the Veteran’s pronouns</span>
  </>
);

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

const pronounsLabels = {
  heHimHis: 'He/him/his',
  sheHerHers: 'She/her/hers',
  theyThemTheirs: 'They/them/theirs',
  zeZirZirs: 'Ze/zir/zirs',
  useMyPreferredName: 'Use my preferred name',
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
  preferredName: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  socialOrServiceNum: {
    type: 'object',
    properties: {
      ssn: ssnSchema,
      serviceNumber: serviceNumberSchema,
    },
    required: ['ssn'],
  },
  socialNum: ssnSchema,
  branchOfService: selectSchema(branchesOfService),
  dateOfBirth: dateOfBirthSchema,
  pronouns: {
    type: 'object',
    properties: {
      ...createBooleanSchemaPropertiesFromOptions(pronounsLabels),
      ...{ pronounsNotListedText: { type: 'string' } },
    },
    required: [],
  },
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
  preferredName: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  socialNum: ssnSchema,
  branchOfService: selectSchema(branchesOfService),
  dateOfBirth: dateOfBirthSchema,
  pronouns: {
    type: 'object',
    properties: {
      ...createBooleanSchemaPropertiesFromOptions(pronounsLabels),
      ...{ pronounsNotListedText: { type: 'string' } },
    },
    required: [],
  },
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
  pronouns: {
    type: 'object',
    properties: {
      ...createBooleanSchemaPropertiesFromOptions(pronounsLabels),
      ...{ pronounsNotListedText: { type: 'string' } },
    },
  },
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
  preferredName: {
    'ui:title': `Preferred name`,
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      pattern: 'This field accepts alphabetic characters only',
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
  branchOfService: {
    'ui:title': 'Branch of service',
    'ui:webComponentField': VaSelectField,
    'ui:options': {
      hideIf: () => true,
    },
  },
  dateOfBirth: { ...dateOfBirthUI(), 'ui:required': () => true },
  pronouns: {
    'ui:title': pronounInfo,
    // 'ui:validations': [validateGroup],
    'ui:options': { showFieldLabel: true },
    ...createUiTitlePropertiesFromOptions(pronounsLabels),
    pronounsNotListedText: {
      'ui:title':
        'If not listed, please provide your preferred pronouns (255 characters maximum)',
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
  preferredName: {
    'ui:title': `Preferred name`,
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      pattern: 'This field accepts alphabetic characters only',
    },
    'ui:options': {
      uswds: true,
    },
  },
  socialOrServiceNum: {
    'ui:title': ssnServiceInfo,
    'ui:validations': [validateGroup],
    'ui:options': {
      uswds: true,
      showFieldLabel: true,
      hideIf: formData =>
        (formData.questionAbout === 'SOMEONE_ELSE' &&
          formData.personalRelationship === 'WORK') ||
        (formData.questionAbout === 'SOMEONE_ELSE' &&
          formData.personalRelationship === 'FAMILY_MEMBER') ||
        (formData.questionAbout === 'MYSELF' &&
          formData.personalRelationship === 'FAMILY_MEMBER') ||
        formData.questionAbout === 'GENERAL',
    },
    ssn: ssnUI(),
    serviceNumber: serviceNumberUI('Service number'),
  },
  socialNum: {
    ...ssnUI(),
    'ui:required': formData =>
      formData.questionAbout === 'MYSELF' &&
      formData.personalRelationship === 'FAMILY_MEMBER',
    'ui:options': {
      uswds: true,
      hideIf: formData =>
        !(
          formData.questionAbout === 'MYSELF' &&
          formData.personalRelationship === 'FAMILY_MEMBER'
        ),
    },
  },
  branchOfService: {
    'ui:title': 'Branch of service',
    'ui:webComponentField': VaSelectField,
    'ui:required': formData =>
      (formData.questionAbout === 'MYSELF' ||
        formData.questionAbout === 'SOMEONE_ELSE') &&
      formData.personalRelationship === 'VETERAN' &&
      (formData.selectCategory === 'Veteran Identification Card (VIC)' ||
        formData.selectCategory === 'Survivor Benefits' ||
        formData.selectCategory === 'Burial & Memorial Benefits (NCA)' ||
        formData.selectCategory === "Women Veterans' issues" ||
        formData.selectCategory === 'Benefits Issues Outside the US'),
    'ui:options': {
      uswds: true,
      hideIf: formData =>
        !(
          (formData.questionAbout === 'MYSELF' ||
            formData.questionAbout === 'SOMEONE_ELSE') &&
          formData.personalRelationship === 'VETERAN' &&
          (formData.selectCategory === 'Veteran Identification Card (VIC)' ||
            formData.selectCategory === 'Survivor Benefits' ||
            formData.selectCategory === 'Burial & Memorial Benefits (NCA)' ||
            formData.selectCategory === "Women Veterans' issues" ||
            formData.selectCategory === 'Benefits Issues Outside the US')
        ),
    },
  },
  dateOfBirth: {
    ...dateOfBirthUI(),
    'ui:required': formData =>
      !(
        (formData.questionAbout === 'SOMEONE_ELSE' &&
          formData.personalRelationship === 'WORK') ||
        (formData.questionAbout === 'SOMEONE_ELSE' &&
          formData.personalRelationship === 'FAMILY_MEMBER') ||
        formData.questionAbout === 'GENERAL'
      ),
    'ui:options': {
      uswds: true,
      hideIf: formData =>
        (formData.questionAbout === 'SOMEONE_ELSE' &&
          formData.personalRelationship === 'WORK') ||
        (formData.questionAbout === 'SOMEONE_ELSE' &&
          formData.personalRelationship === 'FAMILY_MEMBER') ||
        formData.questionAbout === 'GENERAL',
    },
  },
  pronouns: {
    'ui:title': pronounInfo,
    'ui:required': () => false,
    'ui:options': { showFieldLabel: true },
    ...createUiTitlePropertiesFromOptions(pronounsLabels),
    pronounsNotListedText: {
      'ui:title':
        'If not listed, please provide your preferred pronouns (255 characters maximum)',
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
  pronouns: {
    'ui:title': pronounInfo,
    'ui:options': { showFieldLabel: true },
    ...createUiTitlePropertiesFromOptions(pronounsLabels),
    pronounsNotListedText: {
      'ui:title':
        'If not listed, please provide your preferred pronouns (255 characters maximum)',
    },
  },
};
