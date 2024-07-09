import React from 'react';

import {
  issueTitle,
  content,
  errorMessages,
} from '../content/areaOfDisagreement';

import { areaOfDisagreementRequired } from '../../../shared/validations/areaOfDisagreement';
import {
  calculateOtherMaxLength,
  disagreeWith,
} from '../../../shared/utils/areaOfDisagreement';
import {
  MAX_LENGTH,
  DISAGREEMENT_TYPES,
  SUBMITTED_DISAGREEMENTS,
  FORMAT_READABLE_DATE_FNS,
  FORMAT_YMD_DATE_FNS,
} from '../../../shared/constants';
import { getIssueName, getIssueDate } from '../../../shared/utils/issues';
import { parseDate } from '../../../shared/utils/dates';

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
        // Not used by CustomPage, kept here for review & submit page render
        disagreementOptions: {
          'ui:title': content.disagreementLegend,
          'ui:description': content.disagreementHint,
          serviceConnection: {
            'ui:title': DISAGREEMENT_TYPES.serviceConnection,
          },
          effectiveDate: {
            'ui:title': DISAGREEMENT_TYPES.effectiveDate,
          },
          evaluation: {
            'ui:title': DISAGREEMENT_TYPES.evaluation,
          },
        },
        otherEntry: {
          'ui:title': DISAGREEMENT_TYPES.otherEntry,
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

  review: data => ({
    'The issues you’re asking the Board to review:': data.areaOfDisagreement
      ?.length ? (
      <ul className="vads-u-margin-top--1">
        {data.areaOfDisagreement.map((disagreement, index) => (
          <li key={index}>
            <div className="issue-title">{getIssueName(disagreement)}</div>
            <div>
              Decision date:{' '}
              {parseDate(
                getIssueDate(disagreement),
                FORMAT_YMD_DATE_FNS,
                FORMAT_READABLE_DATE_FNS,
              )}
            </div>
            <div>{disagreeWith(disagreement)}</div>
          </li>
        ))}
      </ul>
    ) : (
      <span className="usa-input-error-message">No issues selected</span>
    ),
  }),
};
