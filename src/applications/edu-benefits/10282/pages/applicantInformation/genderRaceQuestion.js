import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { raceAndGender } = fullSchema10282.definitions;
const description = (
  <>
    <p>
      The next few questions are about race, gender, education, and employment.
      These questions are optional. You don’t need to answer them.
    </p>
    <p>
      We ask these questions for statistical purposes. Your answers won’t affect
      your eligibility for the IBM SkillsBuild program.
    </p>
  </>
);
const uiSchema = {
  'ui:description': description,
  raceAndGender: {
    'ui:title': 'Do you want to answer the optional questions?',
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
