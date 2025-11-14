import React from 'react';
import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Burial location'),
    'view:remainsEligibilityAlert': {
      'ui:description': (
        <VaAlert status="warning" className="vads-u-margin-bottom--2" uswds>
          <h2 slot="headline">Check medallion eligibility</h2>
          <p>
            If the Veteran's remains aren't buried, they may not be eligible for
            a medallion.
          </p>
        </VaAlert>
      ),
      'ui:options': {
        hideIf: formData => formData.remainsBuriedInGrave !== 'no',
        displayEmptyObjectOnReview: true,
      },
    },
    remainsBuriedInGrave: radioUI({
      title: "Are the Veteran's remains buried in their grave?",
      labels: { yes: 'Yes', no: 'No' },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:remainsEligibilityAlert': { type: 'object', properties: {} },
      remainsBuriedInGrave: radioSchema(['yes', 'no']),
    },
  },
};
