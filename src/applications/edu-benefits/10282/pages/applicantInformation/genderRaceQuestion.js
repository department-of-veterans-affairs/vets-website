import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const { raceAndGender } = fullSchema10282.definitions;

const uiTitle = (
  <>
    <h3
      className="vads-u-margin--0 vads-u-color--base"
      data-testid="optional-demographic"
    >
      Optional demographic information
    </h3>
    <p>
      The next few questions are about race and gender. These questions are
      optional. You don’t have to answer them.
    </p>
    <p>
      We ask these questions for statistical purposes. Your answers won’t affect
      your eligibility for the IBM SkillsBuild program.
    </p>
    <p className="vads-u-margin-bottom--0">
      Do you want to answer these optional questions?
    </p>
  </>
);

const uiSchema = {
  raceAndGender: {
    'ui:title': uiTitle,
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
