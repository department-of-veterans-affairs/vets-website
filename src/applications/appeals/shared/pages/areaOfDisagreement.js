import {
  issueTitle,
  getIssueTitle,
  content,
  errorMessages,
  AreaOfDisagreementReviewField,
} from '../content/areaOfDisagreement';
import { areaOfDisagreementRequired } from '../validations/areaOfDisagreement';
import { calculateOtherMaxLength } from '../utils/areaOfDisagreement';

import {
  DISAGREEMENT_TYPES,
  MAX_LENGTH,
  SUBMITTED_DISAGREEMENTS,
} from '../constants';

// add 1 for last comma
const allDisagreementsLength =
  Object.values(SUBMITTED_DISAGREEMENTS).join(',').length + 1;

export default {
  uiSchema: {
    areaOfDisagreement: {
      items: {
        'ui:title': issueTitle,
        'ui:required': () => true,
        'ui:validations': [areaOfDisagreementRequired],
        'ui:errorMessages': {
          required: errorMessages.missingDisagreement,
        },
        'ui:objectViewField': AreaOfDisagreementReviewField,
        'ui:options': {
          itemAriaLabel: data => getIssueTitle(data, { plainText: true }),
        },
        // Not used by CustomPage, kept here for review & submit page render
        disagreementOptions: {
          'ui:title': content.disagreementLegend,
          serviceConnection: {
            'ui:title': DISAGREEMENT_TYPES.serviceConnection,
            'ui:options': {
              hideOnReview: true,
            },
          },
          effectiveDate: {
            'ui:title': DISAGREEMENT_TYPES.effectiveDate,
            'ui:options': {
              hideOnReview: true,
            },
          },
          evaluation: {
            'ui:title': DISAGREEMENT_TYPES.evaluation,
            'ui:options': {
              hideOnReview: true,
            },
          },
        },
        otherEntry: {
          'ui:title': DISAGREEMENT_TYPES.otherEntry,
          'ui:description': content.otherEntryHint,
          'ui:options': {
            hideOnReview: true,
            updateSchema: (formData, _schema, _uiSchema, index) => ({
              type: 'string',
              maxLength: calculateOtherMaxLength(
                formData.areaOfDisagreement[index],
              ),
            }),
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
