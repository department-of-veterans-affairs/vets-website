import _ from 'lodash';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { confirmationEmailUI } from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
import fullNameUI from './fullName/fullName';

import fullSchema from '../0873-schema.json';
import * as address from './address/address';
import {
  emailAddressError,
  phoneNumberError,
  phoneTitle,
  preferredContactMethodTitle,
  verifyEmailAddressError,
  organizationalRoleTitle,
  departmentalIndividualTypeTitle,
} from '../../constants/labels';

const { email, phone } = fullSchema.definitions;

const {
  fullName,
  preferredContactMethod,
  organizationalRole,
  departmentalIndividualType,
} = fullSchema.properties;

const formFields = {
  organizationalRole: 'organizationalRole',
  departmentalIndividualType: 'departmentalIndividualType',
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
    [formFields.organizationalRole]: {
      'ui:title': organizationalRoleTitle,
      'ui:widget': 'radio',
    },
    [formFields.departmentalIndividualType]: {
      'ui:title': departmentalIndividualTypeTitle,
      'ui:widget': 'radio',
      'ui:required': formData =>
        formData.organizationalRole === 'departmental-individual',
      'ui:options': {
        expandUnder: formFields.organizationalRole,
        expandUnderCondition: 'departmental-individual',
      },
    },
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
    required: [
      formFields.preferredContactMethod,
      formFields.fullName,
      formFields.organizationalRole,
    ],
    properties: {
      [formFields.fullName]: fullName,
      [formFields.organizationalRole]: organizationalRole,
      [formFields.departmentalIndividualType]: departmentalIndividualType,
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
