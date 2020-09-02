import set from 'platform/utilities/data/set';

import { countries } from 'platform/forms/address';

import { confirmationEmailUI } from '../../../caregivers/definitions/caregiverUI';
import fullSchema from '../../0873-schema.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';

const countryValues = countries.map(object => object.value);
const countryNames = countries.map(object => object.label);

const { fullName, email, preferredContactMethod } = fullSchema.definitions;

const { relationshipToVeteran, branchOfService } = fullSchema.properties;

const formFields = {
  preferredContactMethod: 'preferredContactMethod',
  fullName: 'fullName',
  address: 'address',
  email: 'email',
  verifyEmail: 'view:email',
  phoneNumber: 'phoneNumber',
  relationshipToVeteran: 'relationshipToVeteran',
  branchOfService: 'branchOfService',
  country: 'country',
};

const contactInformationPage = {
  uiSchema: {
    [formFields.fullName]: {
      title: {
        'ui:title': 'Title',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
        },
      },
      ...fullNameUI,
    },
    [formFields.relationshipToVeteran]: {
      'ui:title': 'I am asking about benefits/services',
    },
    [formFields.branchOfService]: {
      'ui:title': 'Branch of service',
      'ui:required': formData =>
        formData.relationshipToVeteran !==
        relationshipToVeteran.enum.slice(-1)[0],
      'ui:options': {
        expandUnder: 'relationshipToVeteran',
        hideIf: formData =>
          formData.relationshipToVeteran ===
          relationshipToVeteran.enum.slice(-1)[0],
      },
    },
    [formFields.country]: {
      'ui:title': 'Country',
    },
    [formFields.preferredContactMethod]: {
      'ui:title': 'How would you like to be contacted?',
      'ui:widget': 'radio',
    },
    [formFields.email]: set(
      'ui:required',
      (formData, _index) => formData.preferredContactMethod === 'email',
      emailUI(),
    ),
    [formFields.verifyEmail]: confirmationEmailUI('', formFields.email),
  },
  schema: {
    type: 'object',
    required: [
      formFields.preferredContactMethod,
      formFields.fullName,
      formFields.relationshipToVeteran,
      formFields.country,
    ],
    properties: {
      [formFields.fullName]: fullName,
      [formFields.relationshipToVeteran]: relationshipToVeteran,
      [formFields.branchOfService]: branchOfService,
      [formFields.country]: {
        default: 'USA',
        type: 'string',
        enum: countryValues,
        enumNames: countryNames,
      },
      [formFields.preferredContactMethod]: preferredContactMethod,
      [formFields.email]: email,
      [formFields.verifyEmail]: {
        type: 'string',
      },
    },
  },
};

export default contactInformationPage;
