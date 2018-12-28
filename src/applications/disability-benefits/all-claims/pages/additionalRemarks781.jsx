import React from 'react';

import { ptsd781NameTitle } from '../content/ptsdClassification';

const additionalRemarksDescription = <h3>Additional information</h3>;

export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': additionalRemarksDescription,
  additionalRemarks781: {
    'ui:title':
      'If there is anything else you would like to tell us about the events or situations that contributed to your PTSD, you can provide that information below. You’ll have a chance to upload any supporting documents or statements to support your claim later in the application.',
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
