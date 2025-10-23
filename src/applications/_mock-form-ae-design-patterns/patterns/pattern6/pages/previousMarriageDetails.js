import React from 'react';
import {
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import dateUI from 'platform/forms-system/src/js/definitions/date';

export default {
  showPagePerItem: true,
  arrayPath: 'veteranMarriageHistory',
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Former Marriage Information',
      nounSingular: 'former marriage',
    }),
    spouseName: {
      'ui:title': 'Name of former spouse',
      'ui:options': {
        viewField: ({ formData }) => <span>{formData}</span>,
      },
    },
    marriageDate: {
      ...dateUI('Date of marriage'),
      'ui:options': {
        viewField: ({ formData }) => <span>{formData}</span>,
      },
    },
    marriageLocation: {
      'ui:title': 'Location of marriage',
      'ui:options': {
        viewField: ({ formData }) => <span>{formData}</span>,
      },
    },
    marriageEndDate: {
      ...dateUI('Date marriage ended'),
      'ui:options': {
        viewField: ({ formData }) => <span>{formData}</span>,
      },
    },
    marriageEndReason: {
      'ui:title': 'How did the marriage end?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          DIVORCE: 'Divorce',
          ANNULMENT: 'Annulment',
          DEATH: 'Death',
          OTHER: 'Other',
        },
        viewField: ({ formData }) => <span>{formData}</span>,
      },
    },
  },
  schema: {
    type: 'object',
    required: [
      'spouseName',
      'marriageDate',
      'marriageLocation',
      'marriageEndReason',
      'marriageEndDate',
    ],
    properties: {
      spouseName: { type: 'string' },
      marriageDate: currentOrPastDateSchema,
      marriageLocation: { type: 'string' },
      marriageEndDate: currentOrPastDateSchema,
      marriageEndReason: {
        type: 'string',
        enum: ['DIVORCE', 'ANNULMENT', 'DEATH', 'OTHER'],
      },
    },
  },
};
