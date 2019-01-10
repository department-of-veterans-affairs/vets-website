import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const {
  receiveExpectDisabilityRetirement,
  receiveExpectWorkersCompensation,
} = fullSchema.properties.form8940.properties.unemployability.properties;

const supplementalBenefitsTitle = <h4>Supplemental benefits</h4>;

const supplementalBenefitsHelp = (
  <AdditionalInfo triggerText="How do these benefits affect my claim?">
    <p>
      {' '}
      You claim for unemployability won‘t be affected if you get supplemental
      benefits, such as Social Security disability or workers‘ compensation. VA
      and Social Security Administration are separate agencies.
    </p>
    <p>
      If you have a Social Security benefit letter, you may want to upload it to
      support your claim.
    </p>
  </AdditionalInfo>
);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': supplementalBenefitsTitle,
  unemployability: {
    receiveExpectDisabilityRetirement: {
      'ui:title':
        'Do you receive, or expect to receive, disability retirement benefits?',
      'ui:widget': 'yesNo',
    },
    receiveExpectWorkersCompensation: {
      'ui:title':
        'Do you receive, or expect to receive, workers‘ compensation benefits? ',
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
