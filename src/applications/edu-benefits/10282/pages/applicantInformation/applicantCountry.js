import React from 'react';
import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { country } = fullSchema10282.definitions;

export const uiSchema = {
  'ui:title': (
    <h3
      className="vads-u-margin--0 vads-u-color--base"
      data-testid="country-field"
    >
      What country do you live in?
    </h3>
  ),
  country: {
    'ui:title': 'Country',
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:webComponentField': VaSelectField,
    'ui:errorMessages': {
      required: 'You must select a country',
    },
  },
};

export const schema = {
  type: 'object',
  required: ['country'],
  properties: {
    country,
  },
};
