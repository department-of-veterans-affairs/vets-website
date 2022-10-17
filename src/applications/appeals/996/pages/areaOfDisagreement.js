import {
  issueName,
  issusDescription,
  serviceConnection,
  effectiveDate,
  evaluation,
  AreaOfDisagreementReviewField,
  otherLabel,
  otherDescription,
  missingAreaOfDisagreementErrorMessage,
} from '../content/areaOfDisagreement';

import { areaOfDisagreementRequired } from '../validations/issues';
import { calculateOtherMaxLength } from '../utils/disagreement';
import { getIssueName } from '../utils/helpers';
import { MAX_LENGTH, SUBMITTED_DISAGREEMENTS } from '../constants';

// add 1 for last comma
const allDisagreementsLength =
  Object.values(SUBMITTED_DISAGREEMENTS).join(',').length + 1;

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
        },
        otherEntry: {
          'ui:title': otherLabel,
          'ui:description': otherDescription,
          'ui:options': {
            updateSchema: (formData, _schema, uiSchema, index) => ({
              type: 'string',
              maxLength: calculateOtherMaxLength(
                formData.areaOfDisagreement[index],
              ),
            }),
            // index is appended to this ID in the TextWidget
            ariaDescribedby: 'other_hint_text',
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
              },
            },
            otherEntry: {
              type: 'string',
              // disagreementArea limited to 90 chars max
              maxLength:
                MAX_LENGTH.DISAGREEMENT_REASON - allDisagreementsLength,
            },
          },
        },
      },
    },
  },
};
