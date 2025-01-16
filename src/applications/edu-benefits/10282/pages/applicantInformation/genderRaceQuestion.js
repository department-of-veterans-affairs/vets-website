import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

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
  raceAndGender: yesNoUI('Do you want to answer these optional questions?'),
};

const schema = {
  type: 'object',
  properties: {
    raceAndGender: yesNoSchema,
  },
};

export { uiSchema, schema };
