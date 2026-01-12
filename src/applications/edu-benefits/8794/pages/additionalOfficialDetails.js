import {
  textUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  emailUI,
  emailSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateWhiteSpace } from 'platform/forms/validations';

const uiSchema = {
  additionalOfficialDetails: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Tell us about your certifying official',
    }),
    fullName: fullNameNoSuffixUI(
      title =>
        `${title.charAt(0).toUpperCase() +
          title.slice(1)} of certifying official`,
    ),
    title: {
      ...textUI({
        title: 'Title of certifying official',
        errorMessages: {
          required: 'Enter a title',
        },
        validations: [validateWhiteSpace],
      }),
    },
    emailAddress: emailUI({
      title: 'Email address of certifying official',
      errorMessages: {
        required:
          'Enter a valid email address without spaces using this format: email@domain.com',
      },
    }),
    phoneNumber: internationalPhoneUI('Your phone number'),
  },
};

const schema = {
  type: 'object',
  properties: {
    additionalOfficialDetails: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 60,
        },
        phoneNumber: internationalPhoneSchema(),
        emailAddress: emailSchema,
      },
      required: ['title', 'phoneNumber', 'emailAddress'],
    },
  },
};

export { uiSchema, schema };
