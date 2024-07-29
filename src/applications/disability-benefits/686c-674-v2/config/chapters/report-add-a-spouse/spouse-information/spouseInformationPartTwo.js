// import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
// import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import {
  ssnUI,
  ssnSchema,
  // dateOfBirthUI,
  // dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
// import vaFileNumberUI from 'platform/forms-system/src/js/definitions/vaFileNumber';
import { generateTitle } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    spouseInformation: {
      type: 'object',
      properties: {
        ssn: ssnSchema,
        // birthDate: dateOfBirthSchema,
      },
    },
  },
};

export const uiSchema = {
  spouseInformation: {
    'ui:title': generateTitle('Spouse’s identification information'),
    ssn: ssnUI('Spouse’s Social Security number'),
    birthDate: {
      //   ...currentOrPastDateUI('Spouse’s date of birth'),
      //   ...{
      //     'ui:required': formData =>
      //       isChapterFieldRequired(formData, 'addSpouse'),
      //   },
    },
    // isVeteran: {
    //   //   'ui:title': 'Is your spouse a Veteran?',
    //   //   'ui:widget': 'yesNo',
    //   //   'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
    // },
    // vaFileNumber: {
    //   //   ...vaFileNumberUI,
    //   //   'ui:title': 'Spouse’s VA file number',
    // },
    // serviceNumber: {
    //   //   'ui:title': 'Spouse’s service number',
    //   //   'ui:errorMessages': { pattern: 'Enter a valid Service Number' },
    //   //   'ui:options': {
    //   //     widgetClassNames: 'usa-input-medium',
    //   //     expandUnder: 'isVeteran',
    //   //     hideEmptyValueInReview: true,
    //   //   },
    // },
  },
};
