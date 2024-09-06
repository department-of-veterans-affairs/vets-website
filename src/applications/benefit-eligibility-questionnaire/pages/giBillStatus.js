import React from 'react';

export default {
  uiSchema: {
    giBillStatus: {
      'ui:title': (
        <>
          <p>
            <b>Have you applied for and been awarded GI Bill benefits?</b>
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
          appliedAndReceived: {
            giBillStatus: "I've applied and received GI Bill benefits",
          },
          submitted: {
            giBillStatus: "I've submitted but haven't received a decision yet",
          },
          started: {
            giBillStatus: "I've started the process but haven't submitted yet",
          },
          notApplied: {
            giBillStatus: "I haven't applied for GI Bill benefits",
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      giBillStatus: {
        type: 'string',
        enum: [
          "I've applied and received GI Bill benefits",
          "I've submitted but haven't received a decision yet",
          "I've started the process but haven't submitted yet",
          "I haven't applied for GI Bill benefits",
        ],
      },
    },
  },
};
