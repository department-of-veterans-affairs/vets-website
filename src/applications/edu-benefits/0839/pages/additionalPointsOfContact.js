import React from 'react';
import {
  titleUI,
  firstNameLastNameNoSuffixUI,
  firstNameLastNameNoSuffixSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getAdditionalContactTitle } from '../helpers';

const pageDescription = (
  <va-link
    text="Review additional instructions for the Yellow Ribbon Program Agreement"
    href="/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions"
    external
  />
);

export const uiSchema = {
  ...titleUI({
    title: ({ formData }) => getAdditionalContactTitle(formData),
    description: pageDescription,
  }),
  additionalPointsOfContact: {
    fullName: firstNameLastNameNoSuffixUI(),
    phoneNumber: internationalPhoneUI('Phone number'),
    email: emailUI('Email'),
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalPointsOfContact: {
      type: 'object',
      properties: {
        fullName: firstNameLastNameNoSuffixSchema,
        phoneNumber: internationalPhoneSchema(),
        email: emailSchema,
      },
      required: ['fullName', 'phoneNumber', 'email'],
    },
  },
  required: ['additionalPointsOfContact'],
};
