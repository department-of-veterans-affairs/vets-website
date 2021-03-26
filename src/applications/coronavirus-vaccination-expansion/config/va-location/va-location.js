import React from 'react';
import DynamicCheckboxWidget from './DynamicCheckboxWidget.jsx';

export const schema = {
  vaLocation: {
    type: 'object',
    properties: {
      preferredFacility: {
        type: 'string',
      },
    },
  },
};

export const uiSchema = {
  vaLocation: {
    preferredFacility: {
      'ui:widget': DynamicCheckboxWidget,
      'ui:options': {
        hideLabelText: true,
      },
      'ui:reviewField': ({ children, schema, uiSchema }) => (
        <div className="review-row">
          <p>Derp</p>
          <dt>
            {uiSchema['ui:title']}
            {uiSchema['ui:description']}
          </dt>
        </div>
      ),
    },
  },
};
