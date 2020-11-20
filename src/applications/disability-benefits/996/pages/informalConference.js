import React from 'react';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';
import ScheduleTimesReviewField from '../content/ScheduleTimesReviewField';

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
  InformalConferenceTimeLabels,
  AttemptsInfoAlert,
} from '../content/InformalConference';

const scheduleTimeUiSchema = key => ({
  'ui:title': InformalConferenceTimeLabels(key),
  'ui:options': {
    hideLabelText: true,
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
        updateSchema: (formData, schema) => {
          const choice = formData?.informalConference;
          // informalConferenceTimes title needs to know this setting, so we'll
          // use CSS to control the view instead of doing some complicated form
          // data manipulation
          if (choice && document) {
            document.querySelector('article').dataset.contactChoice = choice;
          }
          return schema;
        },
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
        'ui:options': {
          hideIf: formData => formData?.informalConference !== 'rep',
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
          hideIf: formData => formData?.informalConference !== 'rep',
        },
      },
    },
    informalConferenceTimes: {
      'ui:title': <InformalConferenceTimes />,
      'ui:required': formData => formData?.informalConference !== 'no',
      'ui:errorMessages': {
        required: errorMessages.informalConferenceTimesMin,
      },
      'ui:validations': [checkConferenceTimes],
      time0800to1000: scheduleTimeUiSchema('time0800to1000'),
      time1000to1230: scheduleTimeUiSchema('time1000to1230'),
      time1230to1400: scheduleTimeUiSchema('time1230to1400'),
      time1400to1630: scheduleTimeUiSchema('time1400to1630'),
      'ui:options': {
        showFieldLabel: true,
        hideIf: formData => formData?.informalConference === 'no',
        expandUnder: 'informalConference',
      },
    },
    'view:alert': {
      'ui:title': '',
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
        },
      },
      informalConferenceTimes: {
        type: 'object',
        properties: {
          time0800to1000: {
            type: 'boolean',
          },
          time1000to1230: {
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
