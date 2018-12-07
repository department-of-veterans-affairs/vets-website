import React from 'react';

import { ptsd781NameTitle } from '../content/ptsdClassification';

const additionalRemarksDescription = (
  <div>
    <h3>Additional Remarks</h3>
    <p>
      If there is anything else you would like to tell us about the stressful
      events that contributed to your PTSD, you can provide that information
      below.
    </p>
    <p>
      If you have any supporting documents or buddy statements to support your
      claim, you‘ll have a chance to upload those later in the application.
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': additionalRemarksDescription,
  additionalRemarks781: {
    'ui:title': ' ',
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5,
      maxLength: 32000,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    additionalRemarks781: {
      type: 'string',
      properties: {},
    },
  },
};
