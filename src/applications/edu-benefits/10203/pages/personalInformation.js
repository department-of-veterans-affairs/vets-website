import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms/definitions/address';
import createContactInformationPage from '../../pages/contactInformation';

const addressUiSchema = address.uiSchema('Your address');
const contactInformation = createContactInformationPage(fullSchema10203);
const ciUiSchema = contactInformation.uiSchema;
const ciSchemaProperties = contactInformation.schema.properties;
const { preferredContactMethod, receiveTexts } = fullSchema10203.properties;

import {
  receiveTextsNote,
  receiveTextsAlert,
} from '../content/personalInformation';

export const { title } = contactInformation;
export const { path } = contactInformation;
export const uiSchema = {
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
        data['view:otherContactInfo']?.mobilePhone?.length >= 10,
    },
  },
  'view:receiveTextsInfo': {
    'ui:description': receiveTextsNote,
  },
};

export const schema = {
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
