import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns/';
import { preparerIdentifications } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerIdentification: radioUI({
      title: 'Which of these best describes you?',
      labels: {
        [preparerIdentifications.veteran]:
          'I’m a Veteran, and I intend to file a VA claim for myself',
        [preparerIdentifications.survivingDependent]:
          'I’m the spouse or child of a Veteran, and I intend to file a VA claim for myself',
        [preparerIdentifications.thirdPartyVeteran]:
          'I’m representing a Veteran who intends to file a VA claim',
        [preparerIdentifications.thirdPartySurvivingDependent]:
          'I’m representing a Veteran’s spouse or child who intends to file a VA claim (called the claimant in this form)',
      },
      labelHeaderLevel: '3',
      errorMessages: {
        enum: 'Select one that best describes you',
        required: 'Select one that best describes you',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['preparerIdentification'],
    properties: {
      preparerIdentification: radioSchema(
        Object.values(preparerIdentifications),
      ),
    },
  },
};
