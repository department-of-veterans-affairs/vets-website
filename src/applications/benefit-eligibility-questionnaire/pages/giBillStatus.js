import React from 'react';

export default {
  uiSchema: {
    giBillStatus: {
      'ui:title': (
        <>
          <p>
            <b>Have you applied for and been approved for GI Bill benefits?</b>
          </p>
          <p>
            This includes the Post-9/11 GI Bill, Montgomery GI Bill Active Duty
            (MGIB-AD), and the Montgomery GI Bill Selected Reserve (MGIB-SR).
          </p>
        </>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        widgetProps: {
          YES: { giBillStatus: 'Yes' },
          NO: { giBillStatus: 'No' },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      giBillStatus: {
        type: 'string',
        enum: ['Yes', 'No'],
      },
    },
  },
};
