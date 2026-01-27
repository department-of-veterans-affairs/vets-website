import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  selectSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';
import { CHAPTER_3, suffixes } from '../../../constants';

const aboutYourselfRelationshipFamilyMemberPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.ABOUT_YOURSELF.TITLE),
    aboutYourself: {
      first: {
        'ui:title': 'First name',
        'ui:webComponentField': VaTextInputField,
        'ui:autocomplete': 'given-name',
        'ui:required': () => true,
        'ui:errorMessages': { required: 'Please provide your first name' },
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
        'ui:errorMessages': { required: 'Please provide your last name' },
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
      dateOfBirth: {
        ...dateOfBirthUI(),
        'ui:errorMessages': {
          required: 'Please provide your date of birth',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      aboutYourself: {
        type: 'object',
        required: ['dateOfBirth', 'first', 'last'],
        properties: {
          first: {
            type: 'string',
            pattern: '^[^0-9]*$',
            minLength: 1,
            maxLength: 30,
          },
          middle: {
            type: 'string',
            pattern: '^[^0-9]*$',
            minLength: 1,
            maxLength: 30,
          },
          last: {
            type: 'string',
            pattern: '^[^0-9]*$',
            minLength: 1,
            maxLength: 30,
          },
          suffix: selectSchema(suffixes),
          dateOfBirth: dateOfBirthSchema,
        },
      },
    },
  },
};

export default aboutYourselfRelationshipFamilyMemberPage;
