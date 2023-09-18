import definitions from 'vets-json-schema/dist/definitions.json';
import React from 'react';
import LearnMoreAboutMilitaryBaseTooltip from '../../../toe/components/LearnMoreAboutMilitaryBaseTooltip';
import YesNoReviewField from '../../../toe/components/YesNoReviewField';
import { uiSchema, schema } from '../../shared/definitions/pdfAddress';

/** @type {PageSchema} */
export default {
  uiSchema: {
    legend: {
      'ui:description': (
        <div>
          <h3>Mailing address</h3>
          <p>
            We'll send any important information about your application to this
            address.
          </p>
        </div>
      ),
    },
    livesOnMilitaryBase: {
      'ui:title': (
        <span id="LiveOnMilitaryBaseTooltip">
          I live on a United States military base outside of the country
        </span>
      ),
      'ui:reviewField': YesNoReviewField,
    },
    livesOnMilitaryBaseInfo: {
      'ui:description': LearnMoreAboutMilitaryBaseTooltip(),
    },
    veteranMailingAddress: uiSchema(''),
  },
  schema: {
    type: 'object',
    required: ['veteranMailingAddress'],
    properties: {
      legend: {
        type: 'object',
        properties: {},
      },
      livesOnMilitaryBase: {
        type: 'boolean',
      },
      livesOnMilitaryBaseInfo: {
        type: 'object',
        properties: {},
      },
      veteranMailingAddress: schema({ definitions }, true),
    },
  },
};
