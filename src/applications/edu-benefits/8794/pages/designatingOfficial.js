import React from 'react';
// import {
//   textSchema,
//   textUI,
// } from 'platform/forms-system/src/js/web-component-patterns/textPatterns';
// import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import {
  titleUI,
  radioSchema,
  radioUI,
  textSchema,
  textUI,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const phoneLabels = {
  us: 'US phone number',
  intl: 'International phone number',
};

const uiSchema = {
  designatingOfficial: {
    ...titleUI('Your information'),
    'ui:description': (
      <p className="vads-u-margin-top--2">
        <strong>Note:</strong> The person filling out and signing this form must
        be a person authorized to enter the school or training establishment
        into a binding agreement with the Department of Veterans Affairs as a
        "designating official".
      </p>
    ),
    first: {
      ...textUI({
        title: 'First name',
        errorMessages: {
          required: 'Enter your first name',
        },
        validations: [
          (errors, fieldData) => {
            if (fieldData.length > 50) {
              errors.addError('Enter your first name with up to 50 characters');
            }
          },
        ],
      }),
    },
    middle: {
      ...textUI({
        title: 'Middle name',
        validations: [
          (errors, fieldData) => {
            if (fieldData.length > 50) {
              errors.addError(
                'Enter your middle name with up to 50 characters',
              );
            }
          },
        ],
      }),
    },
    last: {
      ...textUI({
        title: 'Last name',
        errorMessages: {
          required: 'Enter your last name',
        },
        validations: [
          (errors, fieldData) => {
            if (fieldData.length > 50) {
              errors.addError('Enter your last name with up to 50 characters');
            }
          },
        ],
      }),
    },
    title: {
      ...textUI({
        title: 'Your title',
        errorMessages: {
          required: 'Enter your title',
        },
        validations: [
          (errors, fieldData) => {
            if (fieldData.length > 50) {
              errors.addError('Enter your title with up to 50 characters');
            }
          },
        ],
      }),
    },
    phoneType: radioUI({
      title: 'Select a type of phone number to enter for this individual',
      labels: phoneLabels,
      errorMessages: {
        required: 'Select a type of phone number',
      },
    }),
    phoneNumber: phoneUI({
      title: 'Phone number',
      hint: 'For US phone numbers. Enter a 10-digit phone number.',
      errorMessages: {
        required: 'Enter a 10-digit phone number (with or without dashes)',
      },
    }),
    // 'ui:options': {
    //     // Use updateSchema to set
    //     updateSchema: (formData, formSchema) => {
    //     //   if (formSchema.properties.otherProgramOrBenefit['ui:collapsed']) {
    //     //     return { ...formSchema, required: ['typeOfProgramOrBenefit'] };
    //     //   }
    //     //   return {
    //     //     ...formSchema,
    //     //     required: ['typeOfProgramOrBenefit', 'otherProgramOrBenefit'],
    //     //   };
    //     console.log('formSchema', formSchema);
    //     console.log('formData', formData);
    //     },
    //   },
  },
};

const schema = {
  type: 'object',
  properties: {
    designatingOfficial: {
      type: 'object',
      properties: {
        first: textSchema,
        middle: textSchema,
        last: textSchema,
        title: textSchema,
        phoneType: radioSchema(Object.keys(phoneLabels)),
        phoneNumber: phoneSchema,
      },
      required: ['first', 'last', 'title', 'phoneType'],
    },
  },
};

export { uiSchema, schema };
