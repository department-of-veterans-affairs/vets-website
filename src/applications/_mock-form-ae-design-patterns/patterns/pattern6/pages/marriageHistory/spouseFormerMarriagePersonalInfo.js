import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @returns {PageSchema} */
export default {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: formData => {
        const { first } = formData.spouseFullName || {};
        return `Enter the name of ${first || ''}'s first spouse`;
      },
      nounSingular: 'former marriage',
    }),
    spouseFullName: {
      ...fullNameUI,
      first: {
        ...fullNameUI.first,
        'ui:title': 'First or given name',
      },
      middle: {
        ...fullNameUI.middle,
        'ui:title': 'Middle name',
      },
      last: {
        ...fullNameUI.last,
        'ui:title': 'Last or family name',
      },
      suffix: {
        ...fullNameUI.suffix,
        'ui:title': 'Suffix',
        'ui:options': {
          placeholder: 'Select',
          uswds: true,
        },
      },
    },

    // marriageDate: {
    //   ...dateUI('Date of marriage'),
    //   'ui:options': {
    //     viewField: ({ formData }) => <span>{formData}</span>,
    //   },
    // },
    // marriageLocation: {
    //   'ui:title': 'Location of marriage',
    //   'ui:options': {
    //     viewField: ({ formData }) => <span>{formData}</span>,
    //   },
    // },
    // marriageEndDate: {
    //   ...dateUI('Date marriage ended'),
    //   'ui:options': {
    //     viewField: ({ formData }) => <span>{formData}</span>,
    //   },
    // },
    // marriageEndReason: {
    //   'ui:title': 'How did the marriage end?',
    //   'ui:widget': 'radio',
    //   'ui:options': {
    //     labels: {
    //       DIVORCE: 'Divorce',
    //       ANNULMENT: 'Annulment',
    //       DEATH: 'Death',
    //       OTHER: 'Other',
    //     },
    //     viewField: ({ formData }) => <span>{formData}</span>,
    //   },
    // },
  },
  schema: {
    type: 'object',
    required: [
      'spouseFullName',
      'spouseDateOfBirth',
      // 'marriageDate',
      // 'marriageLocation',
      // 'marriageEndReason',
      // 'marriageEndDate',
    ],
    properties: {
      spouseFullName: fullNameSchema,
      // marriageDate: currentOrPastDateSchema,
      // marriageLocation: { type: 'string' },
      // marriageEndDate: currentOrPastDateSchema,
      // marriageEndReason: {
      //   type: 'string',
      //   enum: ['DIVORCE', 'ANNULMENT', 'DEATH', 'OTHER'],
      // },
    },
  },
};
