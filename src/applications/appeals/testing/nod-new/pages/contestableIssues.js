import React from 'react';

import ContestableIssuesWidget from '../components/ContestableIssuesWidget';
import { ContestableIssuesAdditionalInfo } from '../content/contestableIssues';

import { disagreeWith } from '../../../shared/utils/areaOfDisagreement';
import {
  getIssueDate,
  getIssueName,
  hasSomeSelected,
} from '../../../shared/utils/issues';
import {
  selectionRequired,
  maxIssues,
} from '../../../shared/validations/issues';
import {
  FORMAT_READABLE_DATE_FNS,
  FORMAT_YMD_DATE_FNS,
  SELECTED,
} from '../../../shared/constants';
import { parseDate } from '../../../shared/utils/dates';

/**
 * contestable issues with add issue link (list loop)
 */
const contestableIssues = {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      itemName: 'issues eligible for review',
      forceDivWrapper: true,
    },
    contestedIssues: {
      'ui:title': ' ',
      'ui:field': 'StringField',
      'ui:widget': ContestableIssuesWidget,
      'ui:required': formData => !hasSomeSelected(formData),
      'ui:options': {
        forceDivWrapper: true,
        keepInPageOnReview: true,
        customTitle: 'Issues', // override DL wrapper
      },
      'ui:validations': [selectionRequired, maxIssues],
    },
    'view:disabilitiesExplanation': {
      'ui:description': ContestableIssuesAdditionalInfo,
    },
  },

  schema: {
    type: 'object',
    properties: {
      contestedIssues: {
        type: 'array',
        items: {
          type: 'object',
          properties: {},
          [SELECTED]: 'boolean',
        },
      },
      'view:disabilitiesExplanation': {
        type: 'object',
        properties: {},
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

export default contestableIssues;
