import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import createContactInformationPage from '../../pages/contactInformation';
import { preferredContactMethodTitle } from '../content/personalInformation';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms/definitions/address';

const contactInformation = createContactInformationPage(fullSchema10203);

const preferredContactMethodLabels = {
  mail: 'Mail',
  email: 'Email',
  homePhone: 'Home phone',
  mobilePhone: 'Mobile phone',
};

const ciUiSchema = contactInformation.uiSchema;
const ciSchemaProperties = contactInformation.schema.properties;

const preferredContactMethodUiSchema = () => {
  const uiSchemaCheckbox = {};
  Object.keys(preferredContactMethodLabels).forEach(key => {
    uiSchemaCheckbox[key] = { 'ui:title': preferredContactMethodLabels[key] };
  });
  return uiSchemaCheckbox;
};
const preferredContactMethodSchema = () => {
  const schemaCheckbox = {};
  Object.keys(preferredContactMethodLabels).forEach(key => {
    schemaCheckbox[key] = { type: 'boolean' };
  });
  return schemaCheckbox;
};

export const title = contactInformation.title;
export const path = contactInformation.path;
export const uiSchema = {
  veteranAddress: address.uiSchema('Your address'),
  'view:otherContactInfo': {
    ...ciUiSchema['view:otherContactInfo'],
    homePhone: {
      ...phoneUI('Home phone number'),
      'ui:required': form => form.preferredContactMethod?.homePhone,
    },
    mobilePhone: {
      ...phoneUI('Mobile phone number'),
      'ui:required': form => form.preferredContactMethod?.mobilePhone,
    },
  },
  preferredContactMethod: {
    'ui:title': preferredContactMethodTitle,
    ...preferredContactMethodUiSchema(),
  },
};

export const schema = {
  ...contactInformation.schema,
  properties: {
    veteranAddress: address.schema(fullSchema10203, true),
    'view:otherContactInfo': ciSchemaProperties['view:otherContactInfo'],
    preferredContactMethod: {
      type: 'object',
      properties: {
        ...preferredContactMethodSchema(),
      },
    },
  },
};
