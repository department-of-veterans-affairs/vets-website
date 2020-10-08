import set from 'platform/utilities/data/set';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { confirmationEmailUI } from '../../../caregivers/definitions/caregiverUI';

import fullSchema from '../../0873-schema.json';
import * as address from '../../contactInformation/address/address';
import {
  contactInformationPageDescription,
  preferredContactMethodTitle,
  phoneTitle,
} from '../../content/labels';

const { email, phone } = fullSchema.definitions;

const { fullName, preferredContactMethod } = fullSchema.properties;

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
    'ui:description': contactInformationPageDescription,
    [formFields.fullName]: fullNameUI,
    [formFields.address]: address.uiSchema(
      '',
      true,
      false,
      (formData, _index) => {
        return formData.preferredContactMethod === 'mail';
      },
      true,
    ),
    [formFields.phoneNumber]: set(
      'ui:required',
      (formData, _index) => formData.preferredContactMethod === 'phone',
      phoneUI(phoneTitle),
    ),
    [formFields.email]: set(
      'ui:required',
      (formData, _index) => formData.preferredContactMethod === 'email',
      emailUI(),
    ),
    [formFields.verifyEmail]: confirmationEmailUI('', formFields.email),
    [formFields.preferredContactMethod]: {
      'ui:title': preferredContactMethodTitle,
      'ui:widget': 'radio',
    },
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
    },
  },
};

export default contactInformationPage;
