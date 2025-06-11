import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import capitalize from 'lodash/capitalize';

import { DEMO_OPTIONS } from '../constants';

const demoOptions = DEMO_OPTIONS.reduce((acc, demo) => {
  acc[demo.name] = capitalize(demo.label);

  return acc;
}, {});

const demoDescriptions = DEMO_OPTIONS.reduce((acc, demo) => {
  acc[demo.name] = demo.description;

  return acc;
}, {});

/** @type {PageSchema} */
export default {
  title: 'Choose a demo',
  path: 'demo',
  initialData: {
    ratedDisabilities: [
      {
        name: 'Tinnitus',
        ratedDisabilityId: '111111',
        ratingDecisionId: '0',
        diagnosticCode: 6260,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        maximumRatingPercentage: 100,
        disabilityActionType: 'NONE',
        'view:selected': true,
      },
      {
        name: 'Sciatica',
        ratedDisabilityId: '222222',
        ratingDecisionId: '0',
        diagnosticCode: 8998,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 20,
        maximumRatingPercentage: 100,
        disabilityActionType: 'NONE',
        'view:selected': true,
      },
      {
        name: 'Hypertension',
        ratedDisabilityId: '333333',
        ratingDecisionId: '0',
        diagnosticCode: 7101,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 10,
        maximumRatingPercentage: 100,
        disabilityActionType: 'NONE',
      },
    ],
  },
  uiSchema: {
    demo: radioUI({
      title: 'Choose a demo',
      labels: demoOptions,
      descriptions: demoDescriptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      demo: radioSchema(Object.keys(demoOptions)),
    },
    required: ['demo'],
  },
};
