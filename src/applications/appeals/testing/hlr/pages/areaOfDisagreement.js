import {
  issueTitle,
  getIssueTitle,
  content,
  errorMessages,
  AreaOfDisagreementReviewField,
} from '../../../shared/content/areaOfDisagreement';
import { areaOfDisagreementRequired } from '../../../shared/validations/areaOfDisagreement';
import { calculateOtherMaxLength } from '../../../shared/utils/areaOfDisagreement';

import {
  DISAGREEMENT_TYPES,
  MAX_LENGTH,
  SUBMITTED_DISAGREEMENTS,
} from '../../../shared/constants';

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
        'ui:options': {
          itemAriaLabel: data => getIssueTitle(data, { plainText: true }),
        },
        // Not used by CustomPage, kept here for review & submit page render
        disagreementOptions: {
          'ui:title': content.disagreementLegend,
          serviceConnection: {
            'ui:title': DISAGREEMENT_TYPES.serviceConnection,
            'ui:reviewField': AreaOfDisagreementReviewField,
          },
          effectiveDate: {
            'ui:title': DISAGREEMENT_TYPES.effectiveDate,
            'ui:reviewField': AreaOfDisagreementReviewField,
          },
          evaluation: {
            'ui:title': DISAGREEMENT_TYPES.evaluation,
            'ui:reviewField': AreaOfDisagreementReviewField,
          },
        },
        otherEntry: {
          'ui:title': 'Something else',
          'ui:reviewField': AreaOfDisagreementReviewField,
          'ui:description': content.otherEntryHint,
          'ui:options': {
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
