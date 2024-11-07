import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const { raceAndGender } = fullSchema10282.definitions;

const uiDescription = (
  <>
    <p>
      The next few questions are about race and gender. These questions are
      optional. You don’t have to answer them.
    </p>
    <p>
      We ask these questions for statistical purposes. Your answers won’t affect
      your eligibility for the IBM SkillsBuild program.
    </p>
  </>
);

const uiSchema = {
  ...titleUI('Optional demographic information'),
  'ui:description': uiDescription,
  raceAndGender: {
    'ui:title': 'Do you want to answer these optional questions?',
    'ui:widget': 'radio',
  },
};

const schema = {
  type: 'object',
  properties: {
    raceAndGender: {
      ...raceAndGender,
    },
  },
};

export { uiSchema, schema };
