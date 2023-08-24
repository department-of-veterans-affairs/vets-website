import {
  issueName,
  issusDescription,
  titles,
  AreaOfDisagreementReviewField,
  otherDescription,
  missingAreaOfDisagreementErrorMessage,
} from '../content/areaOfDisagreement';

import { areaOfDisagreementRequired } from '../validations/issues';
import { calculateOtherMaxLength } from '../utils/disagreement';
import { getIssueName } from '../utils/helpers';

import { MAX_LENGTH, SUBMITTED_DISAGREEMENTS } from '../../shared/constants';

// add 1 for last comma
const allDisagreementsLength =
  Object.values(SUBMITTED_DISAGREEMENTS).join(',').length + 1;

const widgetProps = {
  true: { 'aria-describedby': 'disagreement-title' },
  false: { 'aria-describedby': 'disagreement-title' },
};

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
            'ui:title': titles.serviceConnection,
            'ui:reviewField': AreaOfDisagreementReviewField,
            'ui:options': { widgetProps },
          },
          effectiveDate: {
            'ui:title': titles.effectiveDate,
            'ui:reviewField': AreaOfDisagreementReviewField,
            'ui:options': { widgetProps },
          },
          evaluation: {
            'ui:title': titles.evaluation,
            'ui:reviewField': AreaOfDisagreementReviewField,
            'ui:options': { widgetProps },
          },
        },
        otherEntry: {
          'ui:title': titles.otherEntry,
          'ui:reviewField': AreaOfDisagreementReviewField,
          'ui:description': otherDescription,
          'ui:options': {
            updateSchema: (formData, _schema, uiSchema, index) => ({
              type: 'string',
              maxLength: calculateOtherMaxLength(
                formData.areaOfDisagreement[index],
              ),
            }),
            // index is appended to this ID in the TextWidget
            ariaDescribedby: 'disagreement-title other_hint_text',
            hideEmptyValueInReview: true,
            widgetProps,
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
                MAX_LENGTH.HLR_DISAGREEMENT_REASON - allDisagreementsLength,
            },
          },
        },
      },
    },
  },
};
