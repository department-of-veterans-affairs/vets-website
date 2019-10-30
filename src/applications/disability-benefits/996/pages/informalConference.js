// import React from 'react';

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

const {
  representative,
  scheduleTimes,
} = fullSchema.properties.veteran.properties;

const informalConference = {
  uiSchema: {
    veteran: {
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
        'ui:required': formData =>
          formData?.veteran?.informalConferenceChoice === true,
        'ui:options': {
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
        'ui:title': ' ',
        'ui:description': InformalConferenceTimes,
        // TO-DO: determine why...
        // *** ui:required & ui:errorMessages are ignored! ***
        'ui:required': () => true,
        // formData => {
        //   const result = formData?.veteran?.informalConferenceChoice;
        //   console.log('req?', result)
        //   return result === true;
        // },
        'ui:errorMessages': {
          required: errorMessages.informalConferenceTimesMin,
        },
        // 'ui:validations': [checkConferenceTimes],
        time0800to1000: InformalConferenceTimeLabels('time0800to1000'),
        time1000to1200: InformalConferenceTimeLabels('time1000to1200'),
        time1230to1400: InformalConferenceTimeLabels('time1230to1400'),
        time1400to1630: InformalConferenceTimeLabels('time1400to1630'),
        'ui:options': {
          hideIf: formData =>
            // This value may initialize as an object; so we can't use
            // !== 'boolean'
            !(typeof getRepresentativeChoice(formData) === 'boolean'),
          expandUnder: 'informalConferenceChoice',
          // updateSchema: (formData, schema, uiSchema) => {
          //   // console.log('updateSchmea', formData, schema, uiSchema);
          //   return schema;
          // },
        },
      },
      'view:alert': {
        'ui:title': '',
        'ui:description': AttemptsInfoAlert,
        'ui:options': {
          hideIf: formData =>
            !checkConferenceTimes(null, formData?.veteran?.scheduleTimes),
          expandUnder: 'informalConferenceChoice',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteran: {
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
            properties: {},
          },
        },
      },
    },
  },
};

export default informalConference;
