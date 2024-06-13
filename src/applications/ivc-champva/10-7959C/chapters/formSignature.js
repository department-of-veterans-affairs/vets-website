import React from 'react';
import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const formSignatureSchema = {
  uiSchema: {
    ...titleUI('Form signature'),
    certifierRole: {
      ...radioUI({
        title: 'Select who will sign for the beneficiary today.',
        required: () => true,
        labels: {
          applicant: 'The beneficiary',
          spouse: 'The spouse of the beneficiary',
          parentOrGuardian: 'The parent or legal guardian of the beneficiary',
          other:
            'A representative with legal authority to make decisions for the beneficiary who is not also the parent, legal guardian or spouse',
        },
      }),
    },
    'view:additionalInfo': {
      'ui:description': (
        <p className="vads-u-font-size--sm vads-u-padding-left--4">
          Not having a legal document on file with us that proves you have
          authority to make decisions for the beneficiary may cause delays with
          processing this form.
        </p>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantMedicareClass'],
    properties: {
      certifierRole: radioSchema([
        'applicant',
        'spouse',
        'parentOrGuardian',
        'other',
      ]),
      'view:additionalInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
