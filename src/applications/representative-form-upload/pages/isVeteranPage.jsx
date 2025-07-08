import React from 'react';
import {
  titleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CustomAlertPage } from './helpers';

const veteranLabels = {
  yes: 'The claimant is the Veteran',
  no: 'The claimant is a survivor or dependent of the Veteran',
};

/** @type {PageSchema} */
export const isVeteranPage = {
  uiSchema: {
    ...titleUI('Claimant background'),
    isVeteran: radioUI({
      title: "What is the claimant's relationship to the Veteran?",
      labels: veteranLabels,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      isVeteran: radioSchema(['yes', 'no']),
    },
    required: ['isVeteran'],
  },
};

export function IsVeteranPage(props) {
  return <CustomAlertPage {...props} alert={alert} />;
}
