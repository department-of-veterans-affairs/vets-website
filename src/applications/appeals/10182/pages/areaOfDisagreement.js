import {
  issueName,
  issusDescription,
  serviceConnection,
  effectiveDate,
  evaluation,
  other,
  otherLabel,
  missingAreaOfDisagreementErrorMessage,
  missingAreaOfDisagreementOtherErrorMessage,
} from '../content/areaOfDisagreement';

import { areaOfDisagreementRequired } from '../validations';
import { otherTypeSelected } from '../utils/helpers';

export default {
  uiSchema: {
    areaOfDisagreement: {
      items: {
        'ui:title': issueName,
        'ui:description': issusDescription,
        'ui:required': () => true,
        'ui:validations': [areaOfDisagreementRequired],
        'ui:errorMessages': {
          required: missingAreaOfDisagreementErrorMessage,
        },
        'ui:options': {
          // this will show error messages, but breaks the title (no formData)
          // see https://dsva.slack.com/archives/CBU0KDSB1/p1620840904269500
          // showFieldLabel: true,
        },
        disagreementOptions: {
          serviceConnection: {
            'ui:title': serviceConnection,
            'ui:options': {
              hideEmptyValueInReview: true,
            },
          },
          effectiveDate: {
            'ui:title': effectiveDate,
            'ui:options': {
              hideEmptyValueInReview: true,
            },
          },
          evaluation: {
            'ui:title': evaluation,
            'ui:options': {
              hideEmptyValueInReview: true,
            },
          },
          other: {
            'ui:title': other,
            'ui:options': {
              hideEmptyValueInReview: true,
            },
          },
        },
        otherEntry: {
          'ui:title': otherLabel,
          'ui:required': otherTypeSelected,
          'ui:options': {
            hideIf: (formData, index) => !otherTypeSelected(formData, index),
          },
          'ui:errorMessages': {
            required: missingAreaOfDisagreementOtherErrorMessage,
          },
        },
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      areaOfDisagreement: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            disagreementOptions: {
              type: 'object',
              properties: {
                serviceConnection: {
                  type: 'boolean',
                },
                effectiveDate: {
                  type: 'boolean',
                },
                evaluation: {
                  type: 'boolean',
                },
                other: {
                  type: 'boolean',
                },
              },
            },
            otherEntry: {
              type: 'string',
              // disagreementReason limited to 90 chars max
              maxLength: 34,
            },
          },
        },
      },
    },
  },
};
