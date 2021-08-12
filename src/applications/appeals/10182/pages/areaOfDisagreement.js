import {
  issueName,
  issusDescription,
  serviceConnection,
  effectiveDate,
  evaluation,
  other,
  AreaOfDisagreementReviewField,
  otherLabel,
  otherDescription,
  missingAreaOfDisagreementErrorMessage,
  missingAreaOfDisagreementOtherErrorMessage,
} from '../content/areaOfDisagreement';

import { areaOfDisagreementRequired } from '../validations';
import {
  otherTypeSelected,
  calculateOtherMaxLength,
} from '../utils/disagreement';
import { getIssueName } from '../utils/helpers';

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
          // Edit added issue button & specific area of disagreement edit button
          // had duplicate aria-labels. This makes them unique
          itemAriaLabel: data => `${getIssueName(data)} disagreement reasons`,
          // this will show error messages, but breaks the title (no formData)
          // see https://dsva.slack.com/archives/CBU0KDSB1/p1620840904269500
          // showFieldLabel: true,
        },
        disagreementOptions: {
          serviceConnection: {
            'ui:title': serviceConnection,
            'ui:reviewField': AreaOfDisagreementReviewField,
          },
          effectiveDate: {
            'ui:title': effectiveDate,
            'ui:reviewField': AreaOfDisagreementReviewField,
          },
          evaluation: {
            'ui:title': evaluation,
            'ui:reviewField': AreaOfDisagreementReviewField,
          },
          other: {
            'ui:title': other,
            'ui:reviewField': AreaOfDisagreementReviewField,
          },
        },
        otherEntry: {
          'ui:title': otherLabel,
          'ui:description': otherDescription,
          'ui:required': otherTypeSelected,
          'ui:options': {
            hideIf: (formData, index) => !otherTypeSelected(formData, index),
            updateSchema: (formData, _schema, uiSchema, index) => ({
              type: 'string',
              maxLength: calculateOtherMaxLength(
                formData.areaOfDisagreement[index],
              ),
            }),
            // index is appended to this ID in the TextWidget
            ariaDescribedby: 'other_hint_text',
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
              // disagreementArea limited to 90 chars max
              maxLength: 34,
            },
          },
        },
      },
    },
  },
};
