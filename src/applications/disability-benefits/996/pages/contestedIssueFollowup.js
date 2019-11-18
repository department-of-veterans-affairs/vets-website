import fullSchema from '../20-0996-schema.json';

import { validateLength } from 'platform/forms/validations';

import { errorMessages, NULL_CONDITION_STRING } from '../constants';
import {
  contestedIssueNameTitle,
  contestedIssueOfficeTitle,
  contestedIssueOfficeChoiceAlert,
  contestedIssueFollowupDescription,
  contestedIssueFollowupEvidenceInfo,
} from '../content/contestedIssueFollowup';

const {
  useSameOffice,
  additionalNote,
} = fullSchema.definitions.contestedIssues.items.properties;

const contestedIssueFollowup = {
  uiSchema: {
    'ui:title': ' ',
    contestedIssues: {
      'ui:options': {
        viewField: ({ formData }) => formData?.name || NULL_CONDITION_STRING,
        reviewTitle: 'Contested Issues',
        itemName: 'Contested Issue',
      },
      items: {
        'ui:title': contestedIssueNameTitle,
        useSameOffice: {
          'ui:title': contestedIssueOfficeTitle,
          'ui:widget': 'yesNo',
        },
        'view:contestedIssueSameOffice': {
          'ui:description': contestedIssueOfficeChoiceAlert,
          'ui:options': {
            hideIf: (formData, index) =>
              formData?.contestedIssues?.[index]?.useSameOffice !== false,
          },
        },
        additionalNote: {
          'ui:title': contestedIssueFollowupDescription,
          'ui:widget': 'textarea',
          'ui:validations': [
            validateLength(400, errorMessages.contestedIssueCommentLength),
          ],
        },
        'view:evidenceInfo': {
          'ui:description': contestedIssueFollowupEvidenceInfo,
        },
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      contestedIssues: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            useSameOffice,
            'view:contestedIssueSameOffice': {
              type: 'object',
              properties: {},
            },
            additionalNote,
            'view:evidenceInfo': {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};

export default contestedIssueFollowup;
