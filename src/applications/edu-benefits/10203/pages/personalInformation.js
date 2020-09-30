import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import createContactInformationPage from '../../pages/contactInformation';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms/definitions/address';
import environment from 'platform/utilities/environment';

const addressUiSchema = address.uiSchema('Your address');
const contactInformation = createContactInformationPage(fullSchema10203);
const ciUiSchema = contactInformation.uiSchema;
const ciSchemaProperties = contactInformation.schema.properties;
const { preferredContactMethod, receiveTexts } = fullSchema10203.properties;

import {
  receiveTextsNote,
  receiveTextsAlert,
} from '../content/personalInformation';

export const title = contactInformation.title;
export const path = contactInformation.path;
export const uiSchema = environment.isProduction()
  ? {
      'ui:title': 'Your address',
      veteranAddress: {
        ...addressUiSchema,
        street: {
          ...addressUiSchema.street,
          'ui:title': 'Street address',
        },
      },
      'view:otherContactInfo': {
        ...ciUiSchema['view:otherContactInfo'],
        'ui:description':
          'Please enter your contact details below so we can get in touch with you, if necessary.',
        homePhone: {
          ...phoneUI('Home phone number'),
          'ui:required': form => form.preferredContactMethod === 'homePhone',
        },
        mobilePhone: {
          ...phoneUI('Mobile phone number'),
          'ui:required': form => form.preferredContactMethod === 'mobilePhone',
        },
      },
      preferredContactMethod: {
        'ui:title': "What's the best way for us to contact you?",
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            mail: 'Mail',
            email: 'Email',
            homePhone: 'Home phone',
            mobilePhone: 'Mobile phone',
          },
        },
      },
    }
  : {
      veteranAddress: {
        ...addressUiSchema,
        street: {
          ...addressUiSchema.street,
          'ui:title': 'Street address',
        },
      },
      'view:otherContactInfo': {
        ...ciUiSchema['view:otherContactInfo'],
        'ui:description':
          'Please enter your contact details below so we can get in touch with you, if necessary.',
        homePhone: {
          ...phoneUI('Home phone number'),
          'ui:required': form => form.preferredContactMethod === 'homePhone',
        },
        mobilePhone: {
          ...phoneUI('Mobile phone number'),
          'ui:required': form =>
            form.preferredContactMethod === 'mobilePhone' ||
            form.receiveTexts === true,
        },
      },
      preferredContactMethod: {
        'ui:title': "What's the best way for us to contact you?",
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            mail: 'Mail',
            email: 'Email',
            homePhone: 'Home phone',
            mobilePhone: 'Mobile phone',
          },
        },
      },
      receiveTexts: {
        'ui:title':
          'I would like to receive text messages from VA about my GI Bill benefits.',
      },
      'view:housingPaymentInfo': {
        'ui:description': receiveTextsAlert,
        'ui:options': {
          hideIf: data =>
            !data?.receiveTexts ||
            data['view:otherContactInfo']?.mobilePhone?.length >=
              fullSchema10203.definitions.phone.minLength,
        },
      },
      'view:receiveTextsInfo': {
        'ui:description': receiveTextsNote,
      },
    };

export const schema = environment.isProduction()
  ? {
      ...contactInformation.schema,
      properties: {
        veteranAddress: address.schema(fullSchema10203, true),
        'view:otherContactInfo': ciSchemaProperties['view:otherContactInfo'],
        preferredContactMethod,
      },
    }
  : {
      ...contactInformation.schema,
      properties: {
        preferredContactMethod,
        veteranAddress: address.schema(fullSchema10203, true),
        'view:otherContactInfo': ciSchemaProperties['view:otherContactInfo'],
        receiveTexts,
        'view:housingPaymentInfo': {
          type: 'object',
          properties: {},
        },
        'view:receiveTextsInfo': {
          type: 'object',
          properties: {},
        },
      },
    };
