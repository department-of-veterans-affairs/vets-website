import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MUST_MATCH_ALERT } from '../config/constants';
import { onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';

/** @type {PageSchema} */
export const isVeteranPage = {
  uiSchema: {
    ...titleUI('Tell us who the claimant is'),
    isVeteran: {
      ...yesNoUI('Is the claimant also the veteran?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      isVeteran: yesNoSchema,
    },
  },
};

export function IsVeteranPage(props) {
  const alert = MUST_MATCH_ALERT('is-veteran', onCloseAlert, props.data);
  return <CustomAlertPage {...props} alert={alert} />;
}
