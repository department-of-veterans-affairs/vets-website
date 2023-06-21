import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import { errorMessages, MAX_LENGTH } from '../constants';

import {
  ContactRepresentativeTitle,
  RepresentativeFirstNameTitle,
  RepresentativeLastNameTitle,
  RepresentativePhoneTitle,
  RepresentativePhoneExtensionTitle,
  RepresentativeEmailTitle,
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
      firstName: {
        'ui:title': RepresentativeFirstNameTitle,
        'ui:required': formData => formData?.informalConference === 'rep',
        'ui:errorMessages': {
          required: errorMessages.informalConferenceContactFirstName,
        },
      },
      lastName: {
        'ui:title': RepresentativeLastNameTitle,
        'ui:required': formData => formData?.informalConference === 'rep',
        'ui:errorMessages': {
          required: errorMessages.informalConferenceContactLastName,
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
      extension: {
        'ui:title': RepresentativePhoneExtensionTitle,
      },
      email: emailUI(RepresentativeEmailTitle),
    },
  },

  // https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v2/200996.json#L79-L92
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
          firstName: {
            type: 'string',
            maxLength: MAX_LENGTH.REP_FIRST_NAME,
          },
          lastName: {
            type: 'string',
            maxLength: MAX_LENGTH.REP_LAST_NAME,
          },
          phone: {
            type: 'string',
            pattern: '^[0-9]{3,21}$',
            maxLength:
              MAX_LENGTH.COUNTRY_CODE +
              MAX_LENGTH.AREA_CODE +
              MAX_LENGTH.PHONE_NUMBER,
          },
          extension: {
            type: 'string',
            pattern: '^[a-zA-Z0-9]{1,10}$',
            maxLength: MAX_LENGTH.PHONE_NUMBER_EXT,
          },
          email: {
            type: 'string',
            format: 'email',
            minLength: 6,
            maxLength: MAX_LENGTH.EMAIL,
          },
        },
      },
    },
  },
};
