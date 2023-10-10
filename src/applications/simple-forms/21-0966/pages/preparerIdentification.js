import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns/';
import { preparerIdentificationKeys } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerIdentification: {
      ...radioUI({
        title: 'Which of these best describes you?',
        labels: {
          VETERAN: 'I’m a Veteran filling this out on behalf of myself.',
          SURVIVING_DEPENDANT:
            'I’m a surviving dependent of a Veteran (also known as a claimant).',
          THIRD_PARTY_VETERAN:
            'I’m an alternate signer, Veteran Service Officer, Fiduciary, or Third party filling this out on behalf of a Veteran.',
          THIRD_PARTY_SURVIVING_DEPENDANT:
            'I am an alternate signer, Veteran Service Officer, Fiduciary, or Third party filling this out on behalf of surviving dependent of a Veteran.',
        },
        labelHeaderLevel: '3',
      }),
      'ui:errorMessages': {
        required: 'Please select your identity',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['preparerIdentification'],
    properties: {
      preparerIdentification: radioSchema(preparerIdentificationKeys),
    },
  },
};
