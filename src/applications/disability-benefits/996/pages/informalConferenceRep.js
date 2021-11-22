import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

import { errorMessages } from '../constants';

import {
  ContactRepresentativeTitle,
  RepresentativeNameTitle,
  RepresentativePhoneTitle,
} from '../content/InformalConference';

import { validatePhone } from '../validations';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    informalConferenceRep: {
      'ui:title': ContactRepresentativeTitle,
      name: {
        'ui:title': RepresentativeNameTitle,
        'ui:required': formData => formData?.informalConference === 'rep',
        'ui:errorMessages': {
          required: errorMessages.informalConferenceContactName,
        },
      },
      phone: {
        'ui:title': RepresentativePhoneTitle,
        'ui:widget': PhoneNumberWidget,
        'ui:reviewWidget': PhoneNumberReviewWidget,
        'ui:required': formData => formData?.informalConference === 'rep',
        'ui:errorMessages': {
          pattern: errorMessages.informalConferenceContactPhonePattern,
          required: errorMessages.informalConferenceContactPhone,
        },
        'ui:validations': [validatePhone],
      },
    },
  },
  schema: {
    type: 'object',
    required: ['informalConference'],
    properties: {
      informalConferenceRep: {
        type: 'object',
        properties: {
          'view:ContactRepresentativeInfo': {
            type: 'object',
            properties: {},
          },
          name: {
            type: 'string',
          },
          phone: {
            type: 'string',
            pattern: '[0-9]+',
          },
        },
      },
    },
  },
};
