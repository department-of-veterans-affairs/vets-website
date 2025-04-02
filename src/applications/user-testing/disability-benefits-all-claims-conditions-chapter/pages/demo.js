import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import capitalize from 'lodash/capitalize';

import { CONDITION_TYPE_RADIO, RATED_OR_NEW_NEXT_PAGE } from '../constants';

const demoOptions = {
  [RATED_OR_NEW_NEXT_PAGE.name]: capitalize(RATED_OR_NEW_NEXT_PAGE.label),
  [CONDITION_TYPE_RADIO.name]: capitalize(CONDITION_TYPE_RADIO.label),
};

/** @type {PageSchema} */
export default {
  title: 'Choose a demo',
  path: 'demo',
  initialData: {
    ratedDisabilities: [
      {
        name: 'Allergies due to Hearing Loss',
        ratedDisabilityId: '1072414',
        ratingDecisionId: '0',
        diagnosticCode: 5260,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 10,
        maximumRatingPercentage: 30,
        disabilityActionType: 'NONE',
        'view:selected': true,
      },
      {
        name: 'Hearing Loss',
        ratedDisabilityId: '1128271',
        ratingDecisionId: '0',
        diagnosticCode: 6100,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 100,
        maximumRatingPercentage: 100,
        disabilityActionType: 'NONE',
        'view:selected': true,
      },
      {
        name: 'Sarcoma Soft-Tissue',
        ratedDisabilityId: '1124345',
        ratingDecisionId: '0',
        diagnosticCode: 8540,
        decisionCode: 'SVCCONNCTED',
        decisionText: 'Service Connected',
        ratingPercentage: 0,
        maximumRatingPercentage: 100,
        disabilityActionType: 'NONE',
      },
    ],
  },
  uiSchema: {
    demo: radioUI({
      title: 'Choose a demo',
      labels: demoOptions,
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
