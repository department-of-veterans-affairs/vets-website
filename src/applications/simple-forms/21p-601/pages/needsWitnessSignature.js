import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    needsWitnessSignature: yesNoUI('Can you sign your full name?'),
    'ui:description': (
      <>
        <p>
          To submit this form online, you must be able to type your full name as
          an electronic signature. If you can only make an X mark instead of
          signing your name, you'll need to use the paper form with 2 witnesses.
        </p>
      </>
    ),
    'view:witnessRequiredAlert': {
      'ui:description': (
        <va-alert status="error" uswds>
          <h3 slot="headline">You must use the paper form</h3>
          <p>
            Online submission isn't available if you can't sign your full name.
            You'll need to:
          </p>
          <ol>
            <li>Download the paper form</li>
            <li>Complete and sign it with your X mark</li>
            <li>Have two witnesses sign the form</li>
            <li>Mail it to VA</li>
          </ol>
          <p>
            <a
              href="https://www.va.gov/find-forms/about-form-21p-601/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download VA Form 21P-601 (PDF)
            </a>
          </p>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => formData.needsWitnessSignature !== false,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['needsWitnessSignature'],
    properties: {
      needsWitnessSignature: yesNoSchema,
      'view:witnessRequiredAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
