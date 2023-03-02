import React from 'react';

export default {
  uiSchema: {
    remarks: {
      'ui:title': (
        <p>
          Please describe any service-connected conditions you may have due to
          your military service. If you have a VA Decision Rating, please
          include that as well.
        </p>
      ),
      'ui:description': (
        <>
          <va-additional-info
            aria-label="Remarks"
            trigger="Why do I need to provide this information?"
          >
            <p>
              A service-connected condition is a disability related to an injury
              or disease that developed during or was aggravated while on active
              duty or active duty for training. VA also pays disability
              compensation for disabilities resulting from injury, heart attack,
              or stroke that occurred during inactive duty training. This
              information helps establish your basic eligibility for a Specially
              Adapted Housing Grant.
            </p>
          </va-additional-info>
        </>
      ),
      'ui:widget': 'textarea',
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      remarks: {
        type: 'string',
      },
    },
  },
};
