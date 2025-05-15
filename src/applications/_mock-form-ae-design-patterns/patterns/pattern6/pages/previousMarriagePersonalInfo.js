import React from 'react';
import {
  // currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
  fullNameUI,
  dateOfBirthUI,
  fullNameSchema,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
// import dateUI from 'platform/forms-system/src/js/definitions/date';

/** @type {PageSchema} */
export default {
  // showPagePerItem: true,
  // arrayPath: 'spouseMarriageHistory',
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: "Previous spouse's name and date of birth",
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
    spouseDateOfBirth: dateOfBirthUI('Date of birth'),
    isPreviousSpouseDeceased: {
      'ui:title': 'My previous spouse is deceased.',
      'ui:webComponentField': VaCheckboxField,
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
      spouseDateOfBirth: dateOfBirthSchema,
      isPreviousSpouseDeceased: { type: 'boolean' },
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
