import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { gender } = fullSchema10282.definitions;

const uiSchema = {
  'ui:title': (
    <h3 className="vads-u-margin--0">Your ethnicity, race, or origin</h3>
  ),
  gender: {
    'ui:title': 'What is your ethnicity?',
    'ui:widget': 'radio',
  },
};

const schema = {
  type: 'object',
  properties: {
    gender,
  },
};

export { uiSchema, schema };
