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

// const pronounInfo = (
//   <>
//     <p className="vads-u-font-weight--bold vads-u-font-family--serif">
//       Pronouns
//     </p>
//     <p className="vads-u-color--gray-medium vads-u-margin-bottom--2">
//       Share this information if you’d like to help us understand the best way to
//       address you.
//     </p>
//     <span>Select all of the Veteran’s pronouns</span>
//   </>
// );

// const genderInfo = (
//   <va-additional-info
//     trigger="What to know before you decide to share your gender identity"
//     class="vads-u-margin-bottom--0"
//     uswds
//   >
//     <div>
//       <p className="vads-u-margin-top--0">
//         Sharing your gender identity on this application is optional. This
//         information can help your health care team know how you wish to be
//         addressed as a person. It can also help your team better assess your
//         health needs and risks. We also use this information to help make sure
//         we’re serving the needs of all Veterans.
//       </p>

//       <p>
//         But you should know that any information you share here goes into your
//         VA-wide records. VA staff outside of the health care system may be able
//         to read this information.
//       </p>

//       <p className="vads-u-margin-bottom--0">
//         We follow strict security and privacy practices to keep your personal
//         information secure. But if you want to share your gender identity in
//         your health records only, talk with your health care team.
//       </p>
//     </div>
//   </va-additional-info>
// );

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

// const pronounsLabels = {
//   heHimHis: 'He/him/his',
//   sheHerHers: 'She/her/hers',
//   theyThemTheirs: 'They/them/theirs',
//   zeZirZirs: 'Ze/zir/zirs',
//   useMyPreferredName: 'Use my preferred name',
// };

// const genderLabels = {
//   M: 'Man',
//   B: 'Non-binary',
//   TM: 'Transgender man',
//   TF: 'Transgender woman',
//   F: 'Woman',
//   N: 'Prefer not to answer',
//   O: 'A gender not listed here',
// };

// const genderOptions = Object.keys(genderLabels);

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
};
// pronouns: {
//   type: 'object',
//   properties: {
//     ...createBooleanSchemaPropertiesFromOptions(pronounsLabels),
//     ...{ pronounsNotListedText: { type: 'string' } },
//   },
//   required: [],
// },
// genderIdentity: {
//   type: 'object',
//   properties: { genderIdentity: { type: 'string', enum: genderOptions } },
// },

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
};
// dob: { ...currentOrPastDateUI('Date of birth'), 'ui:required': () => true },
// pronouns: {
//   'ui:title': pronounInfo,
//   'ui:required': () => true,
//   'ui:validations': [validateGroup],
//   'ui:options': { showFieldLabel: true },
//   ...createUiTitlePropertiesFromOptions(pronounsLabels),
//   pronounsNotListedText: {
//     'ui:title':
//       'If not listed, please provide your preferred pronouns (255 characters maximum)',
//   },
// },
// genderIdentity: {
//   'ui:title': 'Gender identity',
//   'ui:description': genderInfo,
//   genderIdentity: {
//     'ui:widget': 'radio',
//     'ui:title': `Select a gender identity`,
//     'ui:required': () => true,
//     'ui:options': { labels: genderLabels, enumOptions: genderOptions },
//   },
// },

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
    'ui:required': () => true,
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
};
// dob: {
//   ...currentOrPastDateUI('Date of birth'),
//   'ui:required': () => true,
//   'ui:options': {
//     hideIf: formData =>
//       formData.questionAbout === 'SOMEONE_ELSE' &&
//       formData.personalRelationship === 'WORK',
//   },
// },
// pronouns: {
//   'ui:title': pronounInfo,
//   'ui:required': () => true,
//   'ui:validations': [validateGroup],
//   'ui:options': { showFieldLabel: true },
//   ...createUiTitlePropertiesFromOptions(pronounsLabels),
//   pronounsNotListedText: {
//     'ui:title':
//       'If not listed, please provide your preferred pronouns (255 characters maximum)',
//   },
// },
// genderIdentity: {
//   'ui:title': 'Gender identity',
//   'ui:description': genderInfo,
//   genderIdentity: {
//     'ui:widget': 'radio',
//     'ui:title': `Select a gender identity`,
//     'ui:required': () => true,
//     'ui:options': { labels: genderLabels, enumOptions: genderOptions },
//   },
// },
