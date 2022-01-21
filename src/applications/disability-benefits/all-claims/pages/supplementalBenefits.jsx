import React from 'react';

import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const {
  receiveExpectDisabilityRetirement,
  receiveExpectWorkersCompensation,
} = fullSchema.properties.form8940.properties.unemployability.properties;

const supplementalBenefitsHelp = (
  <va-additional-info trigger="How do these benefits affect my claim?">
    <p>
      {' '}
      Your claim for unemployability won’t be affected if you get supplemental
      benefits, such as Social Security disability or workers’ compensation. VA
      and the Social Security Administration are separate agencies.
    </p>
    <p>
      If you have a Social Security benefit letter, you may want to upload it to
      support your claim.
    </p>
  </va-additional-info>
);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': unemployabilityPageTitle('Supplemental benefits'),
  unemployability: {
    receiveExpectDisabilityRetirement: {
      'ui:title':
        'Do you receive, or expect to receive, disability retirement benefits?',
      'ui:widget': 'yesNo',
    },
    receiveExpectWorkersCompensation: {
      'ui:title':
        'Do you receive, or expect to receive, workers’ compensation benefits? ',
      'ui:widget': 'yesNo',
    },
    'view:supplementalBenefitsHelp': {
      'ui:description': supplementalBenefitsHelp,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        receiveExpectDisabilityRetirement,
        receiveExpectWorkersCompensation,
        'view:supplementalBenefitsHelp': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
