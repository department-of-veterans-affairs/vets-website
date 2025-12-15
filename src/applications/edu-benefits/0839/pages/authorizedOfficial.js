import { cloneDeep } from 'lodash';
import { validateWhiteSpace } from 'platform/forms/validations';
import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

// fullNameNoSuffixUI without the middle property
const getFullNameUI = () => {
  const fullNameUI = cloneDeep(fullNameNoSuffixUI());
  delete fullNameUI.middle;
  return fullNameUI;
};

// fullNameNoSuffixSchema without the middle property
const getFullNameSchema = () => {
  const fullNameSchema = cloneDeep(fullNameNoSuffixSchema);
  delete fullNameSchema.properties.middle;
  return fullNameSchema;
};

export const uiSchema = {
  ...titleUI('Provide your contact information and official title'),
  authorizedOfficial: {
    fullName: getFullNameUI(),
    title: textUI({
      title: 'Your official title',
      hint:
        'Enter your full official title as the person authorized to sign this agreement on behalf of your institution',
      errorMessages: {
        required: 'Please enter your official title',
      },
      validations: [validateWhiteSpace],
    }),
    phoneNumber: internationalPhoneUI('Phone number'),
  },
};

export const schema = {
  type: 'object',
  properties: {
    authorizedOfficial: {
      type: 'object',
      properties: {
        fullName: getFullNameSchema(),
        title: {
          ...textSchema,
          minLength: 1,
          maxLength: 50,
        },
        phoneNumber: internationalPhoneSchema(),
      },
      required: ['fullName', 'title', 'phoneNumber'],
    },
  },
  required: ['authorizedOfficial'],
};
