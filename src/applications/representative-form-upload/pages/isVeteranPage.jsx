import React from 'react';
import {
  titleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MUST_MATCH_ALERT } from '../config/constants';
import { onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';

const veteranLabels = {
  yes: 'The claimant is the Veteran',
  no: 'The claimant is a survivor or dependent of the Veteran',
};

/** @type {PageSchema} */
export const isVeteranPage = {
  uiSchema: {
    ...titleUI("What is the claimant's relationship to the Veteran?"),
    isVeteran: radioUI({
      title: 'Tell us who the claimant is',
      description: "What is the claimant's relationship to the Veteran?",
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
  const alert = MUST_MATCH_ALERT('is-veteran', onCloseAlert, props.data);
  return <CustomAlertPage {...props} alert={alert} />;
}
