import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import createContactInformationPage from '../../pages/contactInformation';
import { preferredContactMethodTitle } from '../content/personalInformation';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms/definitions/address';

const addressUiSchema = address.uiSchema('');
const contactInformation = createContactInformationPage(fullSchema10203);
const ciUiSchema = contactInformation.uiSchema;
const ciSchemaProperties = contactInformation.schema.properties;
const { preferredContactMethod } = fullSchema10203.properties;

export const title = contactInformation.title;
export const path = contactInformation.path;
export const uiSchema = {
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
    'ui:title':
      'How should we contact you if we have questions about your application?',
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
};

export const schema = {
  ...contactInformation.schema,
  properties: {
    veteranAddress: address.schema(fullSchema10203, true),
    'view:otherContactInfo': ciSchemaProperties['view:otherContactInfo'],
    preferredContactMethod,
  },
};
