import React from 'react';

import { ptsd781aNameTitle } from '../content/ptsdClassification';

const additionalDescriptionChanges = (
  <h5>Changes in Behavior or Activities: Additional Information</h5>
);

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': additionalDescriptionChanges,
  additionalChanges: {
    'ui:title': 'Enter other behavior changes',
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
    additionalChanges: {
      type: 'string',
    },
  },
};
