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
  'view:isPOC',
  'view:isSCO',
];

const uiSchema = {
  ...titleUI('Your information'),
  ...descriptionUI(
    <>
      <strong>Note:</strong> The person filling out and signing this form must
      be a person authorized to enter the school or training establishment into
      a binding agreement with the Department of Veterans Affairs as an
      authorizing official.
    </>,
  ),
  authorizedOfficial: {
    fullName: fullNameNoSuffixUI(),
    title: textUI({
      title: 'Your title',
      errorMessages: {
        required: 'Enter a title',
      },
      validations: [validateWhiteSpace],
    }),
    'view:phoneType': radioUI({
      title: 'Select a type of phone number to enter for yourself',
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
    'view:isPOC': yesNoUI({
      title:
        'Are you also the Principles of Excellence point of contact for this institution?',
      labels: {
        Y: 'Yes, I am also the Principles of Excellence point of contact',
        N: 'No, I am not the Principles of Excellence point of contact',
      },
      required: () => true,
    }),
    'view:isSCO': yesNoUI({
      title: 'Are you also a school certifying official?',
      labels: {
        Y: 'Yes, I am also a school certifying official',
        N: 'No, I am not a school certifying official',
      },
      required: () => true,
    }),
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        let updateRequiredSchema = [...requiredSchema];

        // US phone number selected
        if (formData.authorizedOfficial['view:phoneType'] === 'us') {
          updateRequiredSchema = [...updateRequiredSchema, 'usPhone'];
        }
        // International phone number selected
        if (formData.authorizedOfficial['view:phoneType'] === 'intl') {
          updateRequiredSchema = [
            ...updateRequiredSchema,
            'internationalPhone',
          ];
        }

        return { ...formSchema, required: [...updateRequiredSchema] };
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    authorizedOfficial: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
        title: textSchema,
        'view:phoneType': radioSchema(['us', 'intl']),
        usPhone: phoneSchema,
        internationalPhone: internationalPhoneDeprecatedSchema,
        email: emailSchema,
        'view:isPOC': yesNoSchema,
        'view:isSCO': yesNoSchema,
      },
      required: [...requiredSchema],
    },
    // newCommitment object created in schema to be populated even if Pages 2-3 are skipped in this Step
    newCommitment: {
      type: 'object',
      properties: {},
    },
  },
};

export { uiSchema, schema };
