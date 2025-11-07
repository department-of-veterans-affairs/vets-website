import React from 'react';
import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Burial location'),
    'view:remainsWarning': {
      'ui:description': (
        <va-alert status="warning" class="vads-u-margin-bottom--2">
          <h3 slot="headline">Check medallion eligibility</h3>
          <p>
            If the Veteran&apos;s remains aren&apos;t buried, they may not be
            eligible for a medallion.
          </p>
        </va-alert>
      ),
      'ui:options': {
        hideIf: formData => formData.remainsBuriedInGrave !== 'no',
      },
    },
    remainsBuriedInGrave: radioUI({
      title: "Are the Veteran's remains buried in their grave?",
      labels: {
        yes: 'Yes',
        no: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:remainsWarning': {
        type: 'object',
        properties: {},
      },
      remainsBuriedInGrave: radioSchema(['yes', 'no']),
    },
  },
};
