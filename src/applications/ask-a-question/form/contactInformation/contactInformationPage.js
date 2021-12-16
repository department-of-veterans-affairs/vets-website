import _ from 'lodash';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import confirmationEmailUI from 'platform/forms-system/src/js/definitions/confirmationEmail';
import fullNameUI from './fullName/fullName';

import fullSchema from '../0873-schema.json';
import * as address from './address/address';
import {
  emailAddressError,
  phoneNumberError,
  phoneTitle,
  preferredContactMethodTitle,
  verifyEmailAddressError,
} from '../../constants/labels';

const { email, phone } = fullSchema.definitions;

const { fullName, preferredContactMethod } = fullSchema.properties;

const formFields = {
  preferredContactMethod: 'preferredContactMethod',
  fullName: 'fullName',
  address: 'address',
  email: 'email',
  verifyEmail: 'view:email',
  phone: 'phone',
  veteranStatus: 'veteranStatus',
};

const contactInformationPage = {
  uiSchema: {
    [formFields.fullName]: fullNameUI,
    [formFields.email]: _.merge(emailUI(), {
      'ui:required': (formData, _index) =>
        formData.preferredContactMethod === 'email',
      'ui:errorMessages': {
        required: emailAddressError,
      },
    }),
    [formFields.verifyEmail]: _.merge(
      confirmationEmailUI('', formFields.email),
      {
        'ui:errorMessages': {
          required: verifyEmailAddressError,
        },
      },
    ),
    [formFields.phone]: _.merge(phoneUI(phoneTitle), {
      'ui:required': (formData, _index) =>
        formData.preferredContactMethod === 'phone',
      'ui:errorMessages': {
        required: phoneNumberError,
      },
    }),
    [formFields.address]: address.uiSchema(
      '',
      true,
      false,
      (formData, _index) => {
        return formData.preferredContactMethod === 'mail';
      },
      true,
    ),
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
      [formFields.phone]: phone,
      [formFields.address]: address.schema(fullSchema, false),
    },
  },
};

export default contactInformationPage;
