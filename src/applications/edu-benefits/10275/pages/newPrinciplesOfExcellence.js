import React from 'react';
import { validateWhiteSpace } from 'platform/forms/validations';
import {
  descriptionUI,
  emailSchema,
  emailUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  internationalPhoneDeprecatedSchema,
  phoneSchema,
  phoneUI,
  radioSchema,
  radioUI,
  textSchema,
  textUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const requiredSchema = [
  'fullName',
  'title',
  'email',
  'view:phoneType',
  'view:isSCO',
];

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
      'view:phoneType': radioUI({
        title: 'Select a type of phone number to enter for this individual',
        labels: {
          us: 'US phone number',
          intl: 'International phone number',
        },
        required: () => true,
        errorMessages: {
          required: 'Select a type of phone number',
        },
      }),
      usPhone: phoneUI({
        title: 'US phone number',
        hint: 'Enter a 10-digit phone number.',
      }),
      internationalPhone: phoneUI({
        title: 'International phone number',
        hint:
          'For non-US phone numbers. Enter a phone number with up to 15 digits.',
        errorMessages: {
          required: 'Enter a phone number with up to 15 digits',
          pattern: 'Enter a phone number with up to 15 digits',
        },
      }),
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
        required: () => true,
      }),
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        let updateRequiredSchema = [...requiredSchema];

        // US phone number selected
        if (
          formData.newCommitment.principlesOfExcellencePointOfContact[
            'view:phoneType'
          ] === 'us'
        ) {
          updateRequiredSchema = [...updateRequiredSchema, 'usPhone'];
        }
        // International phone number selected
        if (
          formData.newCommitment.principlesOfExcellencePointOfContact[
            'view:phoneType'
          ] === 'intl'
        ) {
          updateRequiredSchema = [
            ...updateRequiredSchema,
            'internationalPhone',
          ];
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
            'view:phoneType': radioSchema(['us', 'intl']),
            usPhone: phoneSchema,
            internationalPhone: internationalPhoneDeprecatedSchema,
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

export { uiSchema, schema };
