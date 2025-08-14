import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';

const evidenceTypes = Object.freeze({
  civilianPoliceReports: 'Civilian police reports',
  recordsOfReceivingCare: 'Records of receiving care',
  layOrWitnessStatements: 'Lay or witness statements',
  otherSupportingDocuments: 'Other supporting documents',
});

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Add Document - Document Type',
    'ui:description': 'What kind of supporting document do you want to add?',
    evidenceType: radioUI({
      title: 'What kind of supporting document do you want to add?',
      labelHeaderLevel: '4',
      labels: evidenceTypes,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      evidenceType: {
        type: 'string',
        enum: Object.keys(evidenceTypes).map(key => evidenceTypes[key]),
      },
    },
  },
};
