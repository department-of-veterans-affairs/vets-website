import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import CustomGroupCheckboxField from '../../component/CustomGroupCheckboxField';

const { ethnicity, orginRace } = fullSchema10282.definitions;

const uiSchema = {
  'ui:title': (
    <h3 className="vads-u-margin--0">Your ethnicity, race, or origin</h3>
  ),
  ethnicity: {
    'ui:title': 'What is your ethnicity?',
    'ui:widget': 'radio',
  },
  orginRace: {
    'ui:reviewField': CustomGroupCheckboxField,
    'ui:field': CustomGroupCheckboxField,
    'ui:title': 'What is your race or origin?',
    'ui:description': 'select all that you identify with',
    'ui:options': {
      labels: orginRace.enum,
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    ethnicity,
    orginRace: {
      type: 'array',
      items: {
        type: 'string',
        enum: orginRace.enum,
      },
      uniqueItems: true,
    },
  },
};

export { uiSchema, schema };
