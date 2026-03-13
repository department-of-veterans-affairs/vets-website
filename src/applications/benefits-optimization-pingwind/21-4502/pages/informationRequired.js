import React from 'react';
import { VaSummaryBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  checkboxRequiredSchema,
  checkboxUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const fieldNames = {
  aboutForm: 'acknowledgeAboutForm',
  privacyAct: 'acknowledgePrivacyAct',
};

/** @type {PageSchema} */
export default {
  path: 'information-we-are-required-to-share',
  title: 'Information we are required to share',
  uiSchema: {
    ...titleUI('Information we are required to share'),
    'ui:order': [fieldNames.aboutForm, fieldNames.privacyAct],
    [fieldNames.aboutForm]: checkboxUI({
      title:
        'I understand that VA Form 21-4502 is an application for automobile or adaptive equipment compensation.',
      required: () => true,
      marginTop: 0,
      description: (
        <VaSummaryBox
          id="information-use-summary"
          uswds
          class="vads-u-margin-bottom--2"
        >
          <h2 slot="headline">About VA Form 21-4502</h2>
          <p>
            Use this form if you are a Veteran with a disability and want to
            apply for compensation for a vehicle that meets your needs. This may
            include a specially equipped vehicle or adaptive equipment to help
            you get in and out of your vehicle. Answer all questions fully and
            accurately.
          </p>
        </VaSummaryBox>
      ),
      errorMessages: {
        enum: 'You must acknowledge how VA uses your information to continue.',
        required:
          'You must acknowledge that you understand the purpose of VA Form 21-4502.',
      },
    }),
    [fieldNames.privacyAct]: checkboxUI({
      title: 'I have read and understand the Privacy Act notice.',
      required: () => true,
      marginTop: 0,
      description: (
        <VaSummaryBox
          id="privacy-rights-summary"
          uswds
          class="vads-u-margin-bottom--2 vads-u-margin-top--4"
        >
          <h2 slot="headline">Privacy Act</h2>
          <p>
            The information you provide is protected under the Privacy Act. VA
            will use it only for purposes related to your application for
            automobile or adaptive equipment benefits.
          </p>
        </VaSummaryBox>
      ),
      errorMessages: {
        enum: 'You must acknowledge the Privacy Act notice to continue.',
        required:
          'You must acknowledge that you have read the Privacy Act notice.',
      },
    }),
  },
  schema: {
    type: 'object',
    required: [fieldNames.aboutForm, fieldNames.privacyAct],
    properties: {
      [fieldNames.aboutForm]: checkboxRequiredSchema,
      [fieldNames.privacyAct]: checkboxRequiredSchema,
    },
  },
};
