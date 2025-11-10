import React from 'react';
import { validateWhiteSpace } from 'platform/forms/validations';
import {
  descriptionUI,
  emailSchema,
  emailUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  phoneSchema,
  phoneUI,
  radioSchema,
  radioUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const requiredSchema = ['fullName', 'title', 'email', 'view:phoneType'];

const uiSchema = {
  ...titleUI('School certifying official'),
  ...descriptionUI(
    <>
      Enter the contact information for a school certifying official at your
      institution.
    </>,
  ),
  newCommitment: {
    schoolCertifyingOfficial: {
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
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        let updateRequiredSchema = [...requiredSchema];

        // US phone number selected
        if (
          formData.newCommitment.schoolCertifyingOfficial['view:phoneType'] ===
          'us'
        ) {
          updateRequiredSchema = [...updateRequiredSchema, 'usPhone'];
        }
        // International phone number selected
        if (
          formData.newCommitment.schoolCertifyingOfficial['view:phoneType'] ===
          'intl'
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
            schoolCertifyingOfficial: {
              ...formSchema.properties.schoolCertifyingOfficial,
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
        schoolCertifyingOfficial: {
          type: 'object',
          properties: {
            fullName: fullNameNoSuffixSchema,
            title: textSchema,
            'view:phoneType': radioSchema(['us', 'intl']),
            usPhone: phoneSchema,
            internationalPhone: {
              type: 'string',
              pattern: '^\\+?[0-9](?:-?[0-9]){10,14}$',
            },
            email: emailSchema,
          },
          required: [...requiredSchema],
        },
      },
      required: ['schoolCertifyingOfficial'],
    },
  },
};

export { uiSchema, schema };
