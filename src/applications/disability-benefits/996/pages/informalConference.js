import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';
import ScheduleTimesReviewField from '../containers/ScheduleTimesReviewField';

import { checkConferenceTimes } from '../validations';
import { errorMessages, patternMessages } from '../constants';

import {
  InformalConferenceDescription,
  InformalConferenceTitle,
  informalConferenceLabels,
  ContactRepresentativeDescription,
  RepresentativeNameTitle,
  RepresentativePhoneTitle,
  InformalConferenceTimes,
  informalConferenceTimeAllLabels,
  InformalConferenceTimeLabels,
  AttemptsInfoAlert,
} from '../content/InformalConference';

const scheduleTimeUiSchema = key => ({
  'ui:title': InformalConferenceTimeLabels(key),
  'ui:options': {
    hideLabelText: true,
    // custom entry updated by updateSchema (I know it's bad)
    informalConference: 'me',
  },
  'ui:field': 'StringField',
  'ui:widget': 'checkbox',
  'ui:reviewField': ScheduleTimesReviewField,
});

const informalConference = {
  uiSchema: {
    'ui:title': '',
    'ui:description': InformalConferenceDescription,
    informalConference: {
      'ui:title': InformalConferenceTitle,
      'ui:widget': 'radio',
      'ui:options': {
        labels: informalConferenceLabels,
      },
      'ui:errorMessages': {
        required: errorMessages.informalConferenceContactChoice,
      },
    },
    informalConferenceRep: {
      'ui:title': '',
      'ui:options': {
        hideIf: formData => formData?.informalConference !== 'rep',
        expandUnder: 'informalConference',
      },
      'view:ContactRepresentativeInfo': {
        'ui:title': '',
        'ui:description': ContactRepresentativeDescription,
      },
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
    //     hideIf: formData => formData?.informalConference !== 'me',
    //     expandUnder: 'informalConference',
    //   },
    // },
    // Time selection message you vs rep
    'view:TimesForYou': {
      'ui:title': InformalConferenceTimes,
      'ui:options': {
        hideIf: formData => formData?.informalConference !== 'me',
        expandUnder: 'informalConference',
      },
    },
    informalConferenceTimes: {
      'ui:title': ' ',
      'ui:required': formData => formData?.informalConference !== 'no',
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
        hideIf: formData => formData?.informalConference === 'no',
        expandUnder: 'informalConference',
        updateSchema: (formData, schema, uiSchema) => {
          Object.keys(informalConferenceTimeAllLabels).forEach(time => {
            const options = uiSchema[time]['ui:options'] || {};
            // pass informalConference to children
            options.informalConference = formData?.informalConference;
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
          hideIf: formData => formData?.informalConference !== 'me',
        },
      },
      'view:contactRepresentative': {
        'ui:title': '',
        'ui:description': () => AttemptsInfoAlert({ isRep: true }),
        'ui:options': {
          hideIf: formData => formData?.informalConference !== 'rep',
        },
      },
      'ui:options': {
        hideIf: formData =>
          !checkConferenceTimes(null, formData?.informalConferenceTimes),
        expandUnder: 'informalConference',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['informalConference'],
    properties: {
      informalConference: {
        type: 'string',
        enum: ['no', 'me', 'rep'],
      },
      'view:ContactYouInfo': {
        type: 'object',
        properties: {},
      },
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
          },
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
      informalConferenceTimes: {
        type: 'object',
        properties: {
          time0800to1000: {
            type: 'boolean',
          },
          time1000to1200: {
            type: 'boolean',
          },
          time1230to1400: {
            type: 'boolean',
          },
          time1400to1630: {
            type: 'boolean',
          },
        },
      },
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
