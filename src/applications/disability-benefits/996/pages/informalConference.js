import fullSchema from '../20-0996-schema.json';

import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';

import { checkConferenceTimes } from '../validations';
import { errorMessages } from '../constants';
import { getRepresentativeChoice } from '../helpers';

import {
  InformalConferenceDescription,
  InformalConferenceChoiceTitle,
  InformalConferenceContactChoice,
  ContactYouDescription,
  ContactRepresentativeDescription,
  RepresentativeNameTitle,
  RepresentativePhoneTitle,
  InformalConferenceTimes,
  InformalConferenceTimeLabels,
  AttemptsInfoAlert,
} from '../content/InformalConference';

const { representative, scheduleTimes } = fullSchema.properties;

const informalConference = {
  uiSchema: {
    'ui:title': '',
    'ui:description': InformalConferenceDescription,
    informalConferenceChoice: {
      'ui:title': InformalConferenceChoiceTitle,
      'ui:widget': 'yesNo',
      'ui:errorMessages': {
        required: errorMessages.informalConferenceContactChoice,
      },
    },
    contactRepresentativeChoice: {
      'ui:title': InformalConferenceContactChoice,
      'ui:widget': 'yesNo',
      'ui:required': formData => formData?.informalConferenceChoice === true,
      'ui:options': {
        hideIf: formData => formData?.informalConferenceChoice !== true,
        expandUnder: 'informalConferenceChoice',
      },
      'ui:errorMessages': {
        required: errorMessages.informalContactVARepresentative,
      },
    },
    representative: {
      'ui:title': '',
      'ui:options': {
        hideIf: formData => getRepresentativeChoice(formData) !== true,
        expandUnder: 'informalConferenceChoice',
      },
      'view:ContactRepresentativeInfo': {
        'ui:title': '',
        'ui:description': ContactRepresentativeDescription,
      },
      fullName: {
        'ui:title': RepresentativeNameTitle,
        'ui:required': formData => getRepresentativeChoice(formData) === true,
        'ui:errorMessages': {
          required: errorMessages.informalConferenceContactName,
        },
      },
      phone: {
        'ui:title': RepresentativePhoneTitle,
        'ui:widget': PhoneNumberWidget,
        'ui:required': formData => getRepresentativeChoice(formData) === true,
        'ui:errorMessages': {
          pattern: errorMessages.informalConferenceContactPhonePattern,
          required: errorMessages.informalConferenceContactPhone,
        },
        'ui:options': {
          inputType: 'tel',
        },
      },
    },
    'view:ContactYouInfo': {
      'ui:title': '',
      'ui:description': ContactYouDescription,
      'ui:options': {
        hideIf: formData => getRepresentativeChoice(formData) !== false,
        expandUnder: 'informalConferenceChoice',
      },
    },
    scheduleTimes: {
      'ui:title': InformalConferenceTimes,
      'ui:required': formData => formData?.informalConferenceChoice === true,
      'ui:errorMessages': {
        required: errorMessages.informalConferenceTimesMin,
      },
      'ui:validations': [checkConferenceTimes],
      'ui:options': {
        showFieldLabel: true,
        hideIf: formData =>
          // This value may initialize as an object; so we can't use
          // !== 'boolean'
          !(typeof getRepresentativeChoice(formData) === 'boolean'),
        expandUnder: 'informalConferenceChoice',
      },
      time0800to1000: InformalConferenceTimeLabels('time0800to1000'),
      time1000to1200: InformalConferenceTimeLabels('time1000to1200'),
      time1230to1400: InformalConferenceTimeLabels('time1230to1400'),
      time1400to1630: InformalConferenceTimeLabels('time1400to1630'),
    },
    'view:alert': {
      'ui:title': ' ',
      'view:contactYou': {
        'ui:title': ' ',
        'ui:description': AttemptsInfoAlert,
        'ui:options': {
          hideIf: formData => getRepresentativeChoice(formData) === true,
        },
      },
      'view:contactRepresentative': {
        'ui:title': '',
        'ui:description': () => AttemptsInfoAlert({ isRep: true }),
        'ui:options': {
          hideIf: formData => getRepresentativeChoice(formData) === false,
        },
      },
      'ui:options': {
        hideIf: formData =>
          !checkConferenceTimes(null, formData?.scheduleTimes),
        expandUnder: 'informalConferenceChoice',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['informalConferenceChoice'],
    properties: {
      informalConferenceChoice: {
        type: 'boolean',
      },
      contactRepresentativeChoice: {
        type: 'boolean',
      },
      'view:ContactYouInfo': {
        type: 'object',
        properties: {},
      },
      representative: {
        type: 'object',
        properties: {
          'view:ContactRepresentativeInfo': {
            type: 'object',
            properties: {},
          },
          fullName: representative.fullName,
          phone: representative.phone,
        },
      },
      scheduleTimes,
      'view:alert': {
        type: 'object',
        properties: {
          'view:contactYou': {
            type: 'object',
            properties: {},
          },
          'view:contactRepresentative': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export default informalConference;
