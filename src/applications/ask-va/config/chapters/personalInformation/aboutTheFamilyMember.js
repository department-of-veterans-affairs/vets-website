import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  selectSchema,
  ssnSchema,
  ssnUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';
import { CHAPTER_3, suffixes } from '../../../constants';

const aboutTheFamilyMemberPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.ABOUT_YOUR_FAM_MEM.TITLE),
    aboutTheFamilyMember: {
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
      socialOrServiceNum: { ssn: ssnUI() },
      dateOfBirth: dateOfBirthUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      aboutTheFamilyMember: {
        type: 'object',
        required: ['dateOfBirth'],
        properties: {
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
          suffix: selectSchema(suffixes),
          socialOrServiceNum: {
            type: 'object',
            required: ['ssn'],
            properties: {
              ssn: ssnSchema,
            },
          },
          dateOfBirth: dateOfBirthSchema,
        },
      },
    },
  },
};

export default aboutTheFamilyMemberPage;
