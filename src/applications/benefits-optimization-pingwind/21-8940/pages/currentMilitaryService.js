import React from 'react';

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
        Current Military Service
      </h3>
    ),
    'ui:description': 'Tell us about your current military service.',
    currentlyServing: yesNoUI(
      'Are you currently serving in the Reserve or National Guard?',
    ),
    activeDutyOrders: yesNoUI({
      title:
        'Does your service-connected disability prevent you from performing your military duties?',
      expandUnder: 'currentlyServing',
      expandUnderCondition: true,
      required: formData => formData.currentlyServing === true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      currentlyServing: yesNoSchema,
      activeDutyOrders: yesNoSchema,
    },
    required: ['currentlyServing'],
  },
};
