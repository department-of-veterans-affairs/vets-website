import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

import {
  checkConferenceTimes,
  isFirstConferenceTimeEmpty,
} from '../validations';
import { errorMessages } from '../constants';

import {
  InformalConferenceDescription,
  InformalConferenceTitle,
  informalConferenceTimeTitles,
  informalConferenceLabels,
  informalConferenceTimeAllLabels,
  ContactRepresentativeDescription,
  RepresentativeNameTitle,
  RepresentativePhoneTitle,
  InformalConferenceTimes,
  AttemptsInfoAlert,
} from '../content/InformalConference';

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
          const article = document.querySelector('article');
          // informalConferenceTimes title needs to know this setting, so we'll
          // use CSS to control the view instead of doing some complicated form
          // data manipulation
          if (choice && article) {
            // no article available in unit tests
            article.dataset.contactChoice = choice;
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
          pattern: errorMessages.informalConferenceContactPhonePattern,
          required: errorMessages.informalConferenceContactPhone,
        },
        'ui:options': {
          hideIf: formData => formData?.informalConference !== 'rep',
        },
      },
    },
    informalConferenceTimes: {
      'ui:title': InformalConferenceTimes,
      'ui:options': {
        showFieldLabel: true,
        hideIf: formData => formData?.informalConference === 'no',
        expandUnder: 'informalConference',
        forceDivWrapper: true,
        updateSchema: formData => {
          const time1Setting = formData?.informalConferenceTimes?.time1 || '';
          const time2Setting = formData?.informalConferenceTimes?.time2 || '';
          const enums = Object.keys(informalConferenceTimeAllLabels);
          const enumNames = Object.values(informalConferenceTimeAllLabels);
          return {
            type: 'object',
            properties: {
              time1: {
                type: 'string',
                enum: enums.filter(val => val !== time2Setting),
                enumNames: enumNames.filter(
                  label =>
                    label !== informalConferenceTimeAllLabels[time2Setting],
                ),
              },
              time2: {
                type: 'string',
                enum: enums.filter(val => val !== time1Setting),
                enumNames: enumNames.filter(
                  label =>
                    label !== informalConferenceTimeAllLabels[time1Setting],
                ),
              },
            },
          };
        },
      },
      time1: {
        'ui:title': informalConferenceTimeTitles.first,
        'ui:required': formData => formData?.informalConference !== 'no',
        'ui:validations': [checkConferenceTimes],
        'ui:errorMessages': {
          required: errorMessages.informalConferenceTimes,
        },
      },
      time2: {
        'ui:title': informalConferenceTimeTitles.second,
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
    },
    'view:alert': {
      'ui:title': '',
      'view:contactYou': {
        'ui:title': ' ',
        'ui:description': AttemptsInfoAlert,
        'ui:options': {
          hideIf: formData => formData?.informalConference !== 'me',
          forceDivWrapper: true,
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
        hideIf: isFirstConferenceTimeEmpty,
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
          time1: {
            type: 'string',
          },
          time2: {
            type: 'string',
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
