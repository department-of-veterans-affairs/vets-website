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
  internationalPhoneSchema,
  internationalPhoneUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const requiredSchema = ['fullName', 'title', 'email', 'phoneNumber'];

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
      phoneNumber: internationalPhoneUI('Phone number'),
      email: emailUI({
        errorMessages: {
          required: 'Enter an email address',
        },
      }),
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
            phoneNumber: internationalPhoneSchema(),
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
