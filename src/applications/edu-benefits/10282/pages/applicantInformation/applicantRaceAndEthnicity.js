import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import CustomGroupCheckboxField from '../../components/CustomGroupCheckboxField';

const { ethnicity, orginRace } = fullSchema10282.properties;
const uiSchema = {
  'ui:title': (
    <h3 className="vads-u-margin--0">Your ethnicity, race, or origin</h3>
  ),
  ethnicity: {
    'ui:title': 'What is your ethnicity?',
    'ui:widget': 'radio',
  },
  orginRace: {
    'ui:title': 'What is your race or origin?',
    'ui:description': (
      <p className="vads-u-margin-top--0  vads-u-color--gray-medium">
        select all that you identify with
      </p>
    ),
    'ui:widget': CustomGroupCheckboxField,
    'ui:field': CustomGroupCheckboxField,
    'ui:options': {
      showFieldLabel: true,
      labels: orginRace.enum,
      keepInPageOnReview: true,
      viewField: CustomGroupCheckboxField,
      expandUnderCondition: 'Yes',
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
