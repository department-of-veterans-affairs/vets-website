import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

const institutionDetailsNoFacilityDescription = {
  uiSchema: {
    ...titleUI('Since you don’t have a facility code yet'),
    'view:description': {
      'ui:description': (
        <p>
          Since your facility code has not yet been assigned, every School
          Certifying Official from your training facility must enter “12345678”
          as the VA facility code when completing the required training in the
          SCO Training Portal. This temporary code allows you to proceed with
          any required training while your official facility code is pending.
          Once you receive your assigned VA facility code, be sure to update
          your account in the training portal to reflect the assigned facility
          code.
        </p>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:description': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export { institutionDetailsNoFacilityDescription };
