import React from 'react';
import { genderLabels } from 'platform/static-data/labels';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const { genderIdentification } = fullSchemaHca.properties;

const GenderIdentificationInfo = (
  <>
    <p style={{ color: 'gray' }}>
      Choose the option that best fits how you describe yourself
    </p>
    <AdditionalInfo triggerText="Why we ask for this information">
      <p>
        This information helps your health care team know how you wish to be
        addressed as a person. It also helps your team better assess your health
        needs and risks. Gender identity is one of the factors that can affect a
        person’s health, well-being, and quality of life. We call these factors
        “social determinants of health.”
      </p>
      <p>
        We also collect this information to better understand our Veteran
        community. This helps us make sure that we’re serving the needs of all
        Veterans.
      </p>
    </AdditionalInfo>
  </>
);

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    genderIdentification: {
      'ui:title': 'What is your gender?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: genderLabels,
      },
      'ui:description': GenderIdentificationInfo,
    },
  },
  schema: {
    type: 'object',
    // required: ['gender'],
    properties: {
      genderIdentification,
    },
  },
};
