/* eslint-disable deprecate/import */
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import React from 'react';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import CustomReviewField from '../../../components/CustomReviewField';

const { sigiGenders } = fullSchemaHca.properties;

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

      <va-additional-info trigger="Why we ask for this information">
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
      </va-additional-info>
    </div>
  );
};

export default {
  uiSchema: {
    'ui:description': SIGIGenderDescription,
    sigiGenders: {
      'ui:title': ' ',
      'ui:reviewField': CustomReviewField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          M: 'Man',
          F: 'Woman',
          NB: 'Non-binary',
          TM: 'Transgender Man',
          TF: 'Transgender Female',
          O: 'A gender not listed here',
          NA: 'Prefer not to answer',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      sigiGenders,
    },
  },
};
