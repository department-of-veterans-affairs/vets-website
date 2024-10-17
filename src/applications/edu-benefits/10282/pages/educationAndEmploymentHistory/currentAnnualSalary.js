import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const uiSchema = {
  currentAnnualSalary: {
    'ui:title': (
      <h3 className="vads-u-margin--0" data-testid="annual-salary">
        What’s your current annual salary?
      </h3>
    ),
    'ui:widget': 'radio',
  },
};

const schema = {
  type: 'object',
  properties: {
    currentAnnualSalary: { ...fullSchema10282.properties.currentAnnualSalary },
  },
};

export { uiSchema, schema };
