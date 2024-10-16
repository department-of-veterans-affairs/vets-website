import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { gender } = fullSchema10282.properties;

const uiSchema = {
  'ui:title': (
    <h3 className="vads-u-margin--0 vads-u-color--base" data-testid="gender">
      How would you describe your gender?
    </h3>
  ),
  gender: {
    'ui:title': (
      <p className="vads-u-color--gray-medium vads-u-margin-top--0 vads-u-margin-bottom--0">
        You can change your selection at any time. If you decide you no longer
        want to share your gender identity, select{' '}
        <strong>Prefer not to answer.</strong>
      </p>
    ),
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
