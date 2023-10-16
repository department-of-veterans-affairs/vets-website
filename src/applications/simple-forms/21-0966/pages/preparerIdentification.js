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
          'I’m a Veteran, and I intend to file a VA claim.',
        [preparerIdentifications.survivingDependant]:
          'I’m the spouse or child of a Veteran, and I intend to file a VA claim.',
        [preparerIdentifications.thirdPartyVeteran]:
          'I’m an alternate signer, Veteran Service Officer, fiduciary, or third-party representative for a Veteran who intends to file a VA claim.',
        [preparerIdentifications.thirdPartySurvivingDependant]:
          'I’m an alternate signer, Veterans Service Officer, fiduciary, or third-party representative for a Veteran’s spouse or child who intends to file a VA claim.',
      },
      labelHeaderLevel: '3',
      errorMessages: {
        enum: 'Please select your identity',
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
