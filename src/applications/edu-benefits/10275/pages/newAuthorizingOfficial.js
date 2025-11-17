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

const requiredSchema = [
  'fullName',
  'title',
  'email',
  'phoneNumber',
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
    phoneNumber: internationalPhoneUI('Your phone number'),
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
        phoneNumber: internationalPhoneSchema(),
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

/**
 * Resets the corresponding *newCommitment* object if the POC or SCO question is toggled.
 * Only one toggle can trigger this at a time so one condition - *if* - will be satisfied at a time.
 * @param {*} oldData old form data
 * @param {*} formData new form data
 * @returns updated form data
 */
const updateFormData = (oldData, formData) => {
  const prevPOC = oldData?.authorizedOfficial?.['view:isPOC'];
  const currPOC = formData?.authorizedOfficial?.['view:isPOC'];
  const prevSCO = oldData?.authorizedOfficial?.['view:isSCO'];
  const currSCO = formData?.authorizedOfficial?.['view:isSCO'];

  if (prevPOC !== currPOC) {
    return {
      ...formData,
      newCommitment: {
        ...formData.newCommitment,
        principlesOfExcellencePointOfContact: {},
      },
    };
  }

  if (prevSCO !== currSCO) {
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
