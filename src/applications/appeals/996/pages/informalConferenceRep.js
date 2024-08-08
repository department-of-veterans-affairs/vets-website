import {
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';
import { emailUI } from 'platform/forms-system/src/js/web-component-patterns/emailPattern';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import {
  ContactRepresentativeTitle,
  ContactRepresentativeDescription,
  RepresentativeFirstNameTitle,
  RepresentativeLastNameTitle,
  RepresentativePhoneTitle,
  RepresentativePhoneExtensionTitle,
  RepresentativeEmailTitle,
  RepresentativeReviewWidget,
} from '../content/InformalConferenceRep';
import { validatePhone } from '../validations';
import { errorMessages } from '../constants';

import { MAX_LENGTH } from '../../shared/constants';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    informalConferenceRep: {
      'ui:title': ContactRepresentativeTitle,
      'ui:description': ContactRepresentativeDescription,
      firstName: {
        'ui:title': RepresentativeFirstNameTitle,
        'ui:webComponentField': VaTextInputField,
        'ui:required': formData => formData?.informalConference === 'rep',
        'ui:errorMessages': {
          required: errorMessages.informalConferenceContactFirstName,
        },
        'ui:reviewWidget': RepresentativeReviewWidget,
      },
      lastName: {
        'ui:title': RepresentativeLastNameTitle,
        'ui:webComponentField': VaTextInputField,
        'ui:required': formData => formData?.informalConference === 'rep',
        'ui:errorMessages': {
          required: errorMessages.informalConferenceContactLastName,
        },
        'ui:reviewWidget': RepresentativeReviewWidget,
      },
      phone: {
        ...phoneUI({
          title: RepresentativePhoneTitle,
        }),
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
        'ui:webComponentField': VaTextInputField,
        'ui:reviewWidget': RepresentativeReviewWidget,
      },
      email: {
        ...emailUI({ title: RepresentativeEmailTitle }),
        'ui:reviewWidget': RepresentativeReviewWidget,
      },
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
            maxLength: MAX_LENGTH.HLR_REP_FIRST_NAME,
          },
          lastName: {
            type: 'string',
            maxLength: MAX_LENGTH.HLR_REP_LAST_NAME,
          },
          phone: phoneSchema,
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
