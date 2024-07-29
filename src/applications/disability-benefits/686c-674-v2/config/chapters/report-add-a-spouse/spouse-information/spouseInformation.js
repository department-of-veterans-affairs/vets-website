// // import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
// // import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
// // import vaFileNumberUI from 'platform/forms-system/src/js/definitions/vaFileNumber';
// import { generateTitle, certificateNotice } from '../../../helpers';
// import { addSpouse } from '../../../utilities';

// export const schema = {
//   type: 'object',
//   properties: {
//     spouseInformation: {
//       ...addSpouse.properties.spouseNameInformation.properties.fullName,
//     },
//     'view:certificateNotice': {
//       type: 'object',
//       properties: {},
//     },
//   },
// };

// export const uiSchema = {
//   spouseInformation: {
//     'ui:title': generateTitle('Spouse’s current legal name'),
//     first: {
//       'ui:required': () => true,
//       'ui:title': 'Spouse’s first name',
//       'ui:errorMessages': {
//         required: 'Enter a first name',
//         pattern: 'This field accepts alphabetic characters only',
//       },
//     },
//     middle: {
//       'ui:title': 'Spouse’s middle name',
//       'ui:options': {
//         hideEmptyValueInReview: true,
//       },
//       'ui:errorMessages': {
//         pattern: 'This field accepts alphabetic characters only',
//       },
//     },
//     last: {
//       'ui:required': () => true,
//       'ui:title': 'Spouse’s last name',
//       'ui:errorMessages': {
//         required: 'Enter a last name',
//         pattern: 'This field accepts alphabetic characters only',
//       },
//     },
//   },
//   'view:certificateNotice': {
//     'ui:description': certificateNotice,
//     'ui:options': {
//       hideIf: formData =>
//         formData?.veteranContactInformation?.veteranAddress?.countryName !==
//         'USA', // TODO: Change countryName to country once Step 2 merges
//     },
//   },
// };

import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';
// import { generateTitle, certificateNotice } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    spouseInformation: {
      spouseInformation: fullNameNoSuffixSchema, // Needs to be a nested object if we want to keep the same object
    },
    'view:certificateNotice': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  spouseInformation: fullNameNoSuffixUI(title => `Spouse’s ${title}`),
  'view:certificateNotice': {
    // 'ui:description': certificateNotice,
    'ui:options': {
      hideIf: formData =>
        formData?.veteranContactInformation?.veteranAddress?.countryName !==
        'USA', // TODO: Change countryName to country once Step 2 merges
    },
  },
};
