import {
  // radioSchema,
  // radioUI,
  textUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  // phoneUI,
  // phoneSchema,
  // internationalPhoneDeprecatedUI,
  // internationalPhoneDeprecatedSchema,
  emailUI,
  emailSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateWhiteSpace } from 'platform/forms/validations';

// const phoneLabels = {
//   us: 'US phone number',
//   intl: 'International phone number',
// };

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
    // phoneType: radioUI({
    //   title: 'Select a type of phone number to enter for this individual',
    //   labels: phoneLabels,
    //   errorMessages: {
    //     required: 'Select a type of phone number',
    //   },
    // }),
    // phoneNumber: {
    //   ...phoneUI({
    //     title: 'Phone number of certifying official',
    //     hint: 'For US phone numbers. Enter a 10-digit phone number.',
    //   }),
    //   'ui:errorMessages': {
    //     pattern: 'Enter a 10-digit phone number (with or without dashes)',
    //     required: 'Enter a 10-digit phone number (with or without dashes)',
    //   },
    // },
    // internationalPhoneNumber: {
    //   ...internationalPhoneDeprecatedUI({
    //     title: 'International phone number of certifying official',
    //     hint:
    //       'For non-US phone numbers. Enter a phone number with up to 15 digits.',
    //   }),
    //   'ui:errorMessages': {
    //     pattern: 'Enter a phone number with up to 15 digits',
    //     required: 'Enter a phone number with up to 15 digits',
    //   },
    // },
    emailAddress: emailUI({
      title: 'Email address of certifying official',
      errorMessages: {
        required:
          'Enter a valid email address without spaces using this format: email@domain.com',
      },
    }),
    phoneNumber: internationalPhoneUI('Your phone number'),
    // 'ui:options': {
    //   updateSchema: (formData, formSchema, ui, index) => {
    //     const isAdding = !!formData['additional-certifying-official'];

    //     if (isAdding) {
    //       const addingDetails =
    //         formData['additional-certifying-official'][index]
    //           .additionalOfficialDetails;

    //       if (addingDetails?.phoneType === 'us') {
    //         return {
    //           ...formSchema,
    //           required: ['title', 'phoneType', 'phoneNumber', 'emailAddress'],
    //         };
    //       }
    //       if (addingDetails?.phoneType === 'intl') {
    //         return {
    //           ...formSchema,
    //           required: [
    //             'title',
    //             'phoneType',
    //             'internationalPhoneNumber',
    //             'emailAddress',
    //           ],
    //         };
    //       }
    //       return { ...formSchema };
    //     }

    //     const editingDetails = formData.additionalOfficialDetails;

    //     if (editingDetails?.phoneType === 'us') {
    //       return {
    //         ...formSchema,
    //         required: ['title', 'phoneType', 'phoneNumber', 'emailAddress'],
    //       };
    //     }
    //     if (editingDetails?.phoneType === 'intl') {
    //       return {
    //         ...formSchema,
    //         required: [
    //           'title',
    //           'phoneType',
    //           'internationalPhoneNumber',
    //           'emailAddress',
    //         ],
    //       };
    //     }
    //     return { ...formSchema };
    //   },
    // },
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
        // phoneType: radioSchema(Object.keys(phoneLabels)),
        // phoneNumber: phoneSchema,
        // internationalPhoneNumber: internationalPhoneDeprecatedSchema,
        emailAddress: emailSchema,
      },
      required: ['title', 'phoneNumber', 'emailAddress'],
    },
  },
};

export { uiSchema, schema };
