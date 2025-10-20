import React from 'react';

const IntroductionContent = () => (
  <>
    <va-alert status="info" uswds>
      <h3 slot="headline">Already filed for survivor benefits?</h3>
      <p>
        Do NOT complete this form if you have already applied for survivor
        benefits using VA Form 21P-534EZ or 21P-535. Those forms already include
        accrued benefits claims.
      </p>
    </va-alert>

    <p>
      You can save this application in progress, and come back later to finish
      filling it out.
    </p>
  </>
);

export default {
  uiSchema: {
    'ui:description': IntroductionContent,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
