import React from 'react';
import { validateWhiteSpace } from 'platform/forms/validations';
import {
  descriptionUI,
  emailSchema,
  emailUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  textSchema,
  textUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
  internationalPhoneSchema,
  internationalPhoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const requiredSchema = ['fullName', 'title', 'email', 'phoneNumber'];

const uiSchema = {
  ...titleUI('Principles of Excellence point of contact'),
  ...descriptionUI(
    <>
      Enter the contact information for a school official who will serve as the
      point of contact regarding the Principles of Excellence implementation at
      your institution.
    </>,
  ),
  newCommitment: {
    principlesOfExcellencePointOfContact: {
      fullName: fullNameNoSuffixUI(),
      title: textUI({
        title: 'Title',
        errorMessages: {
          required: 'Enter a title',
        },
        validations: [validateWhiteSpace],
      }),
      phoneNumber: internationalPhoneUI('Phone number'),
      email: emailUI({
        errorMessages: {
          required: 'Enter an email address',
        },
      }),
      'view:isSCO': yesNoUI({
        title: 'Is this person also a school certifying official?',
        labels: {
          Y: 'Yes, they are a school certifying official',
          N: 'No, they are not a school certifying official',
        },
        hideIf: formData => formData?.authorizedOfficial?.['view:isSCO'],
      }),
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        let updateRequiredSchema = [...requiredSchema];

        // SCO question only required if authorizing official is not already selected as the SCO
        if (!formData.authorizedOfficial['view:isSCO']) {
          updateRequiredSchema = [...updateRequiredSchema, 'view:isSCO'];
        }

        return {
          ...formSchema,
          properties: {
            ...formSchema.properties,
            principlesOfExcellencePointOfContact: {
              ...formSchema.properties.principlesOfExcellencePointOfContact,
              required: [...updateRequiredSchema],
            },
          },
        };
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    newCommitment: {
      type: 'object',
      properties: {
        principlesOfExcellencePointOfContact: {
          type: 'object',
          properties: {
            fullName: fullNameNoSuffixSchema,
            title: textSchema,
            phoneNumber: internationalPhoneSchema(),
            email: emailSchema,
            'view:isSCO': yesNoSchema,
          },
          required: [...requiredSchema],
        },
      },
      required: ['principlesOfExcellencePointOfContact'],
    },
  },
};

/**
 * Resets the *schoolCertifyingOfficial* object if the SCO question is toggled.
 * @param {*} oldData old form data
 * @param {*} formData new form data
 * @returns updated form data
 */
const updateFormData = (oldData, formData) => {
  const prev =
    oldData?.newCommitment?.principlesOfExcellencePointOfContact?.[
      'view:isSCO'
    ];
  const curr =
    formData?.newCommitment?.principlesOfExcellencePointOfContact?.[
      'view:isSCO'
    ];

  if (prev !== curr) {
    return {
      ...formData,
      newCommitment: {
        ...formData.newCommitment,
        schoolCertifyingOfficial: {},
      },
    };
  }

  return formData;
};

export { uiSchema, schema, updateFormData };
