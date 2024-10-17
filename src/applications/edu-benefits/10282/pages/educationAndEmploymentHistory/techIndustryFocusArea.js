import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const uiSchema = {
  techIndustryFocusArea: {
    'ui:title': (
      <h3
        className="vads-u-margin--0 vads-u-color--base"
        data-testid="technology-industry"
      >
        What’s your main area of focus in the technology industry?
      </h3>
    ),
    'ui:widget': 'radio',
  },
};

const schema = {
  type: 'object',
  properties: {
    techIndustryFocusArea: {
      ...fullSchema10282.properties.techIndustryFocusArea,
      enum: fullSchema10282.properties.techIndustryFocusArea.enum.sort(),
    },
  },
};

export { uiSchema, schema };
