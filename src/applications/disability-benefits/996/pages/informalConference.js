import fullSchema from '../20-0996-schema.json';

import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';
import ScheduleTimesReviewField from '../containers/ScheduleTimesReviewField';

import { checkConferenceTimes } from '../validations';
import { errorMessages, patternMessages } from '../constants';

import {
  InformalConferenceDescription,
  InformalConferenceChoiceTitle,
  informalConferenceLabels,
  // sContactYouDescription,
  ContactRepresentativeDescription,
  RepresentativeNameTitle,
  RepresentativePhoneTitle,
  InformalConferenceTimes,
  informalConferenceTimeAllLabels,
  InformalConferenceTimeLabels,
  AttemptsInfoAlert,
} from '../content/InformalConference';

const { representative, scheduleTimes } = fullSchema.properties;

const scheduleTimeUiSchema = key => ({
  'ui:title': InformalConferenceTimeLabels(key),
  'ui:options': {
    hideLabelText: true,
    // custom entry updated by updateSchema (I know it's bad)
    informalConferenceChoice: 'me',
  },
  'ui:field': 'StringField',
  'ui:widget': 'checkbox',
  'ui:reviewField': ScheduleTimesReviewField,
});

const informalConference = {
  uiSchema: {
    'ui:title': '',
    'ui:description': InformalConferenceDescription,
    informalConferenceChoice: {
      'ui:title': InformalConferenceChoiceTitle,
      'ui:widget': 'radio',
      'ui:options': {
        labels: informalConferenceLabels,
      },
      'ui:errorMessages': {
        required: errorMessages.informalConferenceContactChoice,
      },
    },
    representative: {
      'ui:title': '',
      'ui:options': {
        hideIf: formData => formData?.informalConferenceChoice !== 'rep',
        expandUnder: 'informalConferenceChoice',
      },
      'view:ContactRepresentativeInfo': {
        'ui:title': '',
        'ui:description': ContactRepresentativeDescription,
      },
      fullName: {
        'ui:title': RepresentativeNameTitle,
        'ui:required': formData => formData?.informalConferenceChoice === 'rep',
        'ui:errorMessages': {
          required: errorMessages.informalConferenceContactName,
        },
      },
      phone: {
        'ui:title': RepresentativePhoneTitle,
        'ui:widget': PhoneNumberWidget,
        'ui:reviewWidget': PhoneNumberReviewWidget,
        'ui:required': formData => formData?.informalConferenceChoice === 'rep',
        'ui:errorMessages': {
          pattern: patternMessages.representativePhone,
          required: errorMessages.informalConferenceContactPhone,
        },
        'ui:options': {
          inputType: 'tel',
        },
      },
      'view:TimesForRep': {
        'ui:title': () => InformalConferenceTimes({ isRep: true }),
      },
    },
    // 'view:ContactYouInfo': {
    //   'ui:title': '',
    //   'ui:description': ContactYouDescription,
    //   'ui:options': {
    //     hideIf: formData => formData?.informalConferenceChoice !== 'me',
    //     expandUnder: 'informalConferenceChoice',
    //   },
    // },
    // Time selection message you vs rep
    'view:TimesForYou': {
      'ui:title': InformalConferenceTimes,
      'ui:options': {
        hideIf: formData => formData?.informalConferenceChoice !== 'me',
        expandUnder: 'informalConferenceChoice',
      },
    },
    scheduleTimes: {
      'ui:title': ' ',
      'ui:required': formData => formData?.informalConferenceChoice !== 'no',
      'ui:errorMessages': {
        required: errorMessages.informalConferenceTimesMin,
      },
      'ui:validations': [checkConferenceTimes],
      time0800to1000: scheduleTimeUiSchema('time0800to1000'),
      time1000to1200: scheduleTimeUiSchema('time1000to1200'),
      time1230to1400: scheduleTimeUiSchema('time1230to1400'),
      time1400to1630: scheduleTimeUiSchema('time1400to1630'),
      'ui:options': {
        showFieldLabel: true,
        hideIf: formData => formData?.informalConferenceChoice === 'no',
        expandUnder: 'informalConferenceChoice',
        updateSchema: (formData, schema, uiSchema) => {
          Object.keys(informalConferenceTimeAllLabels).forEach(time => {
            const options = uiSchema[time]['ui:options'] || {};
            // pass informalConferenceChoice to children
            options.informalConferenceChoice =
              formData?.informalConferenceChoice;
          });
          return schema;
        },
      },
    },
    'view:alert': {
      'ui:title': ' ',
      'view:contactYou': {
        'ui:title': ' ',
        'ui:description': AttemptsInfoAlert,
        'ui:options': {
          hideIf: formData => formData?.informalConferenceChoice !== 'me',
        },
      },
      'view:contactRepresentative': {
        'ui:title': '',
        'ui:description': () => AttemptsInfoAlert({ isRep: true }),
        'ui:options': {
          hideIf: formData => formData?.informalConferenceChoice !== 'rep',
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
        type: 'string',
        enum: ['no', 'me', 'rep'],
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
          'view:TimesForRep': {
            type: 'object',
            properties: {},
          },
        },
      },
      'view:TimesForYou': {
        type: 'object',
        properties: {},
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
