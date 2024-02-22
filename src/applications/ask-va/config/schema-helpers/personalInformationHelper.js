import { mapValues } from 'lodash';
import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import React from 'react';

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

const pronounInfo = (
  <>
    <p className="vads-u-font-weight--bold vads-u-font-family--serif">
      Pronouns
    </p>
    <p className="vads-u-color--gray-medium vads-u-margin-bottom--2">
      Share this information if you’d like to help us understand the best way to
      address you.
    </p>
    <span>Select all of the Veteran’s pronouns</span>
  </>
);

const genderInfo = (
  <p className="vads-u-margin-y--0">
    What to know before you decide to share your gender identity
  </p> // should be a link?
);

const ssnServiceInfo = (
  <>
    <p className="vads-u-font-weight--bold vads-u-font-family--serif">
      Social Security or Service Number
    </p>
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

const genderLabels = {
  M: 'Man',
  B: 'Non-binary',
  TM: 'Transgender man',
  TF: 'Transgender woman',
  F: 'Woman',
  N: 'Prefer not to answer',
  O: 'A gender not listed here',
};

const genderOptions = Object.keys(genderLabels);

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
  last: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  suffix: {
    type: 'string',
    enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
  },
  preferredName: {
    type: 'string',
    pattern: '^[A-Za-z]+$',
    minLength: 1,
    maxLength: 25,
  },
  socialOrServiceNum: {
    type: 'object',
    properties: {
      ssn: {
        type: 'string',
        pattern: '^[0-9]{9}$',
        maxLength: 9,
      },
      serviceNumber: {
        type: 'string',
        pattern: '^[A-Z]{0,2}\\d{5,8}$',
        maxLength: 8,
      },
    },
    required: [],
  },
  dob: {
    type: 'string',
  },
  pronouns: {
    type: 'object',
    properties: {
      ...createBooleanSchemaPropertiesFromOptions(pronounsLabels),
      ...{
        pronounsNotListedText: {
          type: 'string',
        },
      },
    },
    required: [],
  },
  genderIdentity: {
    type: 'object',
    properties: {
      genderIdentity: {
        type: 'string',
        enum: genderOptions,
      },
    },
  },
};

export const personalInformationUiSchemas = {
  first: {
    'ui:title': 'First name',
    'ui:autocomplete': 'given-name',
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please enter a first name',
    },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:autocomplete': 'additional-name',
  },
  last: {
    'ui:title': 'Last name',
    'ui:autocomplete': 'family-name',
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please enter a last name',
    },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium',
      hideEmptyValueInReview: true,
    },
  },
  preferredName: {
    'ui:title': `Preferred name`,
    'ui:errorMessages': {
      pattern: 'This field accepts alphabetic characters only',
    },
  },
  socialOrServiceNum: {
    'ui:title': ssnServiceInfo,
    'ui:required': () => true,
    'ui:validations': [validateGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    ssn: merge(ssnUI, { 'ui:options': { widgetClassNames: null } }),
    serviceNumber: {
      'ui:title': 'Service number',
      'ui:errorMessages': {
        pattern:
          'Veteran service number must start with 0, 1, or 2 letters followed by 5 to 8 digits',
      },
      'ui:options': {
        replaceSchema: () => {
          return {
            type: 'string',
            pattern: '^[a-zA-Z]{0,2}\\d{5,8}$',
            maxLength: 8,
          };
        },
      },
    },
  },
  dob: {
    ...currentOrPastDateUI('Date of birth'),
    'ui:required': () => true,
  },
  pronouns: {
    'ui:title': pronounInfo,
    'ui:required': () => true,
    'ui:validations': [validateGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    ...createUiTitlePropertiesFromOptions(pronounsLabels),
    pronounsNotListedText: {
      'ui:title':
        'If not listed, please provide your preferred pronouns (255 characters maximum)',
    },
  },
  genderIdentity: {
    'ui:title': 'Gender identity',
    'ui:description': genderInfo,
    genderIdentity: {
      'ui:widget': 'radio',
      'ui:title': `Select a gender identity`,
      'ui:required': () => true,
      'ui:options': {
        labels: genderLabels,
        enumOptions: genderOptions,
      },
    },
  },
};

export const personalInformationAboutYourselfUiSchemas = {
  first: {
    'ui:title': 'First name',
    'ui:autocomplete': 'given-name',
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please enter a first name',
    },
  },
  middle: {
    'ui:title': 'Middle name',
    'ui:autocomplete': 'additional-name',
  },
  last: {
    'ui:title': 'Last name',
    'ui:autocomplete': 'family-name',
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please enter a last name',
    },
  },
  suffix: {
    'ui:title': 'Suffix',
    'ui:autocomplete': 'honorific-suffix',
    'ui:options': {
      widgetClassNames: 'form-select-medium',
      hideEmptyValueInReview: true,
    },
  },
  preferredName: {
    'ui:title': `Preferred name`,
    'ui:errorMessages': {
      pattern: 'This field accepts alphabetic characters only',
    },
  },
  socialOrServiceNum: {
    'ui:title': ssnServiceInfo,
    'ui:required': () => true,
    'ui:validations': [validateGroup],
    'ui:options': {
      showFieldLabel: true,
      hideIf: formData =>
        formData.questionAbout === 'SOMEONE_ELSE' &&
        formData.personalRelationship === 'WORK',
    },
    ssn: merge(ssnUI, { 'ui:options': { widgetClassNames: null } }),
    serviceNumber: {
      'ui:title': 'Service number',
      'ui:errorMessages': {
        pattern:
          'Veteran service number must start with 0, 1, or 2 letters followed by 5 to 8 digits',
      },
      'ui:options': {
        replaceSchema: () => {
          return {
            type: 'string',
            pattern: '^[a-zA-Z]{0,2}\\d{5,8}$',
            maxLength: 8,
          };
        },
      },
    },
  },
  dob: {
    ...currentOrPastDateUI('Date of birth'),
    'ui:required': () => true,
    'ui:options': {
      hideIf: formData =>
        formData.questionAbout === 'SOMEONE_ELSE' &&
        formData.personalRelationship === 'WORK',
    },
  },
  pronouns: {
    'ui:title': pronounInfo,
    'ui:required': () => true,
    'ui:validations': [validateGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    ...createUiTitlePropertiesFromOptions(pronounsLabels),
    pronounsNotListedText: {
      'ui:title':
        'If not listed, please provide your preferred pronouns (255 characters maximum)',
    },
  },
  genderIdentity: {
    'ui:title': 'Gender identity',
    'ui:description': genderInfo,
    genderIdentity: {
      'ui:widget': 'radio',
      'ui:title': `Select a gender identity`,
      'ui:required': () => true,
      'ui:options': {
        labels: genderLabels,
        enumOptions: genderOptions,
      },
    },
  },
};
