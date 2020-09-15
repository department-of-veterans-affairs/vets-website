import set from 'platform/utilities/data/set';
import { countries } from 'platform/forms/address';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { confirmationEmailUI } from '../../../caregivers/definitions/caregiverUI';
import { veteranStatusSection } from './veteranStatusSection';

import fullSchema from '../../0873-schema.json';
import pageDescription from '../../content/PageDescription';

const countryValues = countries.map(object => object.value);
const countryNames = countries.map(object => object.label);
const { fullName, email, preferredContactMethod } = fullSchema.definitions;

const formFields = {
  preferredContactMethod: 'preferredContactMethod',
  fullName: 'fullName',
  address: 'address',
  email: 'email',
  verifyEmail: 'view:email',
  phoneNumber: 'phoneNumber',
  country: 'country',
  veteranStatusSection: 'veteranStatusSection',
};

const contactInformationPage = {
  uiSchema: {
    'ui:description': pageDescription('Your contact info'),
    [formFields.fullName]: fullNameUI,
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
    [formFields.veteranStatusSection]: { ...veteranStatusSection.uiSchema },
  },
  schema: {
    type: 'object',
    required: [
      formFields.preferredContactMethod,
      formFields.fullName,
      formFields.country,
    ],
    properties: {
      [formFields.fullName]: fullName,
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
      [formFields.veteranStatusSection]: { ...veteranStatusSection.schema },
    },
  },
};

export default contactInformationPage;
