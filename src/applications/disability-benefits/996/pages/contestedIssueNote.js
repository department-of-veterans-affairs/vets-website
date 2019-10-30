import fullSchema from '../20-0996-schema.json';

// import { validateLength } from 'platform/forms/validations';

import {
  contestedIssueOfficeTitle,
  // contestedIssueOfficeChoiceAlert,
  // contestedIssueNoteDescription,
  // contestedIssueNoteEvidenceInfo,
} from '../content/contestedIssueNote';

const {
  useSameOffice,
  additionalNote,
} = fullSchema.definitions.ratedDisabilities.items.properties;

const contestedIssueNote = {
  uiSchema: {
    'ui:title': 'test1',
    veteran: {
      'ui:title': 'add contested issue note',
      contestedIssues: {
        items: {
          'ui:title': 'Yes',
          useSameOffice: {
            'ui:title': contestedIssueOfficeTitle,
            'ui:widget': 'yesNo',
          },
          // 'view:contestedIssueSameOffice': {
          //   'ui:description': contestedIssueSameOfficeInfo,
          //   // 'ui:options': {
          //   //   hideIf: formData => {
          //   //     const hasSelection = formData.veteran.contestedIssues?.some(
          //   //       entry => entry['view:selected'],
          //   //     );
          //   //     return hasSelection;
          //   //   },
          //   // },
          // },
          // additionalNote: {
          //   'ui:title': ' ',
          //   'ui:description': contestedIssueNoteDescription,
          //   'ui:widget': 'textarea',
          //   'ui:validations': [validateLength(400)],
          // },
          // 'view:evidenceInfo': {
          //   'ui:description': contestedIssueNoteEvidenceInfo,
          // },
        },
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      veteran: {
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
    },
  },
};

export default contestedIssueNote;
