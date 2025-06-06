import React from 'react';
import {
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { DynamicSpouseNameTitle } from '../../helpers/dynamicSpouseNameTitles';

const infoAlert = (
  <va-alert
    status="info"
    disable-analytics="false"
    full-width="false"
    class="vads-u-margin-bottom--4"
  >
    <p className="vads-u-margin-y--0">
      We usually don’t need to contact a former spouse of a Veteran’s spouse. In
      the rare case where we need information from this person, we’ll contact
      you first.
    </p>
  </va-alert>
);

export const buildSpouseFormerMarriageUiSchema = () => ({
  infoAlert: {
    'ui:description': infoAlert,
  },
  'ui:title': DynamicSpouseNameTitle,
  spouseFormerSpouseFullName: {
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
});

export const spouseFormerMarriageSchema = {
  type: 'object',
  required: ['spouseFormerSpouseFullName'],
  properties: {
    infoAlert: {
      type: 'object',
      properties: {},
    },
    spouseFormerSpouseFullName: fullNameSchema,
  },
};

// /** @returns {PageSchema} */
// export default {
//   uiSchema: {
//     // ...arrayBuilderItemFirstPageTitleUI({
//     //   title: 'Former spouse info',
//     //   nounSingular: 'former marriage',
//     //   description: ({ formContext }) => {
//     //     const index = Number(formContext?.pagePerItemIndex ?? 0);
//     //     const item = formContext?.formData?.spousePreviousMarriages?.[index];
//     //     const first = item?.formerSpouseFullName?.first;
//     //     return `Enter the name of ${first || 'your spouse'}'s first spouse`;
//     //   },
//     // }),
//     // arrayBuilderItemFirstPageTitleUI({
//     //   title: ({ formData }) => {
//     //     const { first } = formData.spouseFullName || {};
//     //     return `Enter the name of ${first || 'your spouse'}'s first spouse`;
//     //   },
//     //   nounSingular: 'former marriage',
//     // }),
//     // ...titleUI(({ formContext }) => {
//     //   const index = Number(formContext?.pagePerItemIndex ?? 0);
//     //   const item = formContext?.formData?.spousePreviousMarriages?.[index];
//     //   const first = item?.formerSpouseFullName?.first;
//     //   return `Enter the name of ${first || 'your spouse'}'s first spouse`;
//     // }),
//     // ...titleUI(({ formData }) => {
//     //   const { first } = formData?.spouseFullName || {};
//     //   return `Enter the name of ${first || ''}'s first spouse`;
//     // }),
//     // ...titleUI(({ formData }) => {
//     //   const { first } = formData?.spouseFullName || {};

//     //   return (
//     //     <>
//     //       <h3>Enter the name of {first || ''}'s first spouse</h3>
//     //     </>
//     //   );
//     // }),
//     // ...arrayBuilderItemFirstPageTitleUI({
//     //   title: props => {
//     //     const { formData } = props;
//     //     const { first } = formData?.spouseFullName || {};
//     //     return `Enter the name of ${first || ''}'s first spouse`;
//     //   },
//     //   nounSingular: 'former marriage',
//     // }),
//     spouseFullName: {
//       ...fullNameUI,
//       first: {
//         ...fullNameUI.first,
//         'ui:title': 'First or given name',
//       },
//       middle: {
//         ...fullNameUI.middle,
//         'ui:title': 'Middle name',
//       },
//       last: {
//         ...fullNameUI.last,
//         'ui:title': 'Last or family name',
//       },
//       suffix: {
//         ...fullNameUI.suffix,
//         'ui:title': 'Suffix',
//         'ui:options': {
//           placeholder: 'Select',
//           uswds: true,
//         },
//       },
//     },

//     // marriageDate: {
//     //   ...dateUI('Date of marriage'),
//     //   'ui:options': {
//     //     viewField: ({ formData }) => <span>{formData}</span>,
//     //   },
//     // },
//     // marriageLocation: {
//     //   'ui:title': 'Location of marriage',
//     //   'ui:options': {
//     //     viewField: ({ formData }) => <span>{formData}</span>,
//     //   },
//     // },
//     // marriageEndDate: {
//     //   ...dateUI('Date marriage ended'),
//     //   'ui:options': {
//     //     viewField: ({ formData }) => <span>{formData}</span>,
//     //   },
//     // },
//     // marriageEndReason: {
//     //   'ui:title': 'How did the marriage end?',
//     //   'ui:widget': 'radio',
//     //   'ui:options': {
//     //     labels: {
//     //       DIVORCE: 'Divorce',
//     //       ANNULMENT: 'Annulment',
//     //       DEATH: 'Death',
//     //       OTHER: 'Other',
//     //     },
//     //     viewField: ({ formData }) => <span>{formData}</span>,
//     //   },
//     // },
//   },
//   schema: {
//     type: 'object',
//     required: [
//       'spouseFullName',
//       'spouseDateOfBirth',
//       // 'marriageDate',
//       // 'marriageLocation',
//       // 'marriageEndReason',
//       // 'marriageEndDate',
//     ],
//     properties: {
//       spouseFullName: fullNameSchema,
//       // marriageDate: currentOrPastDateSchema,
//       // marriageLocation: { type: 'string' },
//       // marriageEndDate: currentOrPastDateSchema,
//       // marriageEndReason: {
//       //   type: 'string',
//       //   enum: ['DIVORCE', 'ANNULMENT', 'DEATH', 'OTHER'],
//       // },
//     },
//   },
// };
