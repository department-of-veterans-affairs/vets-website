import {
  fullNameSchema,
  fullNameUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  inlineTitleSchema,
  inlineTitleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name'),
    fullName: fullNameUI(),
    'view:birthTitle': inlineTitleUI('Your date and place of birth'),
    dateOfBirth: dateOfBirthUI(),
    placeOfBirth: {
      'ui:title': 'Place of birth',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: 'City and state or foreign country',
      },
      'ui:errorMessages': {
        required: 'Please enter your place of birth',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameSchema,
      'view:birthTitle': inlineTitleSchema,
      dateOfBirth: dateOfBirthSchema,
      placeOfBirth: {
        type: 'string',
      },
    },
    required: ['fullName', 'dateOfBirth', 'placeOfBirth'],
  },
};
