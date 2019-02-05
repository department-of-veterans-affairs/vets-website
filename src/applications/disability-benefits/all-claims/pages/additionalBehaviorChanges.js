import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';

const additionalDescriptionChanges = (
  <div>
    <h5>Changes in Behavior or Activities: Additional Information</h5>
    <p>
      Please provide additional information about any behavior changes or
      actions you took as a result of the event.
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': additionalDescriptionChanges,
  additionalChanges: {
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
    additionalChanges: {
      type: 'string',
    },
  },
};
