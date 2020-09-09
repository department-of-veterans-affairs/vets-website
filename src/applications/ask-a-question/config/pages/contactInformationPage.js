import set from 'platform/utilities/data/set';
import { countries } from 'platform/forms/address';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { confirmationEmailUI } from '../../../caregivers/definitions/caregiverUI';

import fullSchema from '../../0873-schema.json';
import pageDescription from '../../content/PageDescription';

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
    'ui:description': pageDescription('Your contact info'),
    [formFields.fullName]: fullNameUI,
    [formFields.relationshipToVeteran]: {
      'ui:title': 'My message is about benefits/services',
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
    [formFields.email]: set(
      'ui:required',
      (formData, _index) => formData.preferredContactMethod === 'email',
      emailUI(),
    ),
    [formFields.verifyEmail]: confirmationEmailUI('', formFields.email),
    [formFields.country]: {
      'ui:title': 'Country',
    },
    [formFields.preferredContactMethod]: {
      'ui:title': 'How should we get in touch with you?',
      'ui:widget': 'radio',
    },
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
      [formFields.email]: email,
      [formFields.verifyEmail]: {
        type: 'string',
      },
      [formFields.country]: {
        default: 'USA',
        type: 'string',
        enum: countryValues,
        enumNames: countryNames,
      },
      [formFields.preferredContactMethod]: preferredContactMethod,
    },
  },
};

export default contactInformationPage;
