import set from 'platform/utilities/data/set';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { confirmationEmailUI } from '../../../caregivers/definitions/caregiverUI';

import { veteranStatusUI } from './veteranStatusUI';
import fullSchema from '../../0873-schema.json';
import pageDescription from '../../content/PageDescription';
import * as address from '../../contactInformation/address/address';

const { email, phone } = fullSchema.definitions;

const {
  fullName,
  preferredContactMethod,
  veteranStatus,
} = fullSchema.properties;

const formFields = {
  preferredContactMethod: 'preferredContactMethod',
  fullName: 'fullName',
  address: 'address',
  email: 'email',
  verifyEmail: 'view:email',
  phoneNumber: 'phoneNumber',
  veteranStatus: 'veteranStatus',
};

const contactInformationPage = {
  uiSchema: {
    'ui:description': pageDescription('Your contact info'),
    [formFields.fullName]: fullNameUI,
    [formFields.address]: address.uiSchema(
      '',
      false,
      (formData, _index) => {
        return formData.preferredContactMethod === 'mail';
      },
      false,
    ),
    [formFields.phoneNumber]: set(
      'ui:required',
      (formData, _index) => formData.preferredContactMethod === 'phone',
      phoneUI('Daytime Phone'),
    ),
    [formFields.email]: set(
      'ui:required',
      (formData, _index) => formData.preferredContactMethod === 'email',
      emailUI(),
    ),
    [formFields.verifyEmail]: confirmationEmailUI('', formFields.email),
    [formFields.preferredContactMethod]: {
      'ui:title': 'How should we get in touch with you?',
      'ui:widget': 'radio',
    },
    [formFields.veteranStatus]: veteranStatusUI,
  },
  schema: {
    type: 'object',
    required: [formFields.preferredContactMethod, formFields.fullName],
    properties: {
      [formFields.fullName]: fullName,
      [formFields.preferredContactMethod]: preferredContactMethod,
      [formFields.email]: email,
      [formFields.verifyEmail]: {
        type: 'string',
      },
      [formFields.phoneNumber]: phone,
      [formFields.address]: address.schema(fullSchema, false),
      [formFields.veteranStatus]: veteranStatus,
    },
  },
};

export default contactInformationPage;
