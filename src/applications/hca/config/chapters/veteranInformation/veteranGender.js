// TODO: need to finnish vets-json-schema changes and plug in via schema below
// import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import React from 'react';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

// const { SIGIGenders } = fullSchemaHca.properties;

const genderLabels = [
  { label: 'Woman', value: 'F' },
  { label: 'Man', value: 'M' },
  { label: 'Transgender Woman', value: 'TF' },
  { label: 'Transgender Man', value: 'TM' },
  { label: 'A gender not listed here', value: 'O' },
  { label: 'Non-binary', value: 'NB' },
  { label: 'Prefer not to answer', value: 'NA' },
];

const SIGIGenderDescription = props => {
  return (
    <div className="vads-u-margin-bottom--4">
      <PrefillMessage {...props} />

      <div>
        <p className="vads-u-margin-bottom--1">What is your gender?</p>

        <p className="vads-u-color--gray-medium vads-u-margin-top--0 vads-u-margin-bottom--5">
          Choose the option that best fits how you describe yourself.
        </p>
      </div>

      <AdditionalInfo triggerText="Why we ask for this information">
        <p>
          This information helps your health care team know how you wish to be
          addressed as a person. It also helps your team better assess your
          health needs and risks. Gender identity is one of the factors that can
          affect a person’s health, well-being, and quality of life. We call
          these factors “social determinants of health.”
        </p>

        <p>
          We also collect this information to better understand our Veteran
          community. This helps us make sure that we’re serving the needs of all
          Veterans.
        </p>
      </AdditionalInfo>
    </div>
  );
};

export default {
  uiSchema: {
    'ui:description': SIGIGenderDescription,
    gender: {
      'ui:title': ' ',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          F: 'Woman',
          M: 'Man',
          TF: 'Transgender Female',
          TM: 'Transgender Man',
          O: 'A gender not listed here',
          NB: 'Non-binary',
          NA: 'Prefer not to answer',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      gender: {
        type: 'string',
        enum: genderLabels.map(option => option.value),
      },
    },
  },
};
