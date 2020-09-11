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

const {
  veteranStatus,
  isDependent,
  relationshipToVeteran,
  veteranIsDeceased,
  branchOfService,
} = fullSchema.properties;

const formFields = {
  preferredContactMethod: 'preferredContactMethod',
  fullName: 'fullName',
  address: 'address',
  email: 'email',
  verifyEmail: 'view:email',
  phoneNumber: 'phoneNumber',
  veteranStatus: 'veteranStatus',
  isDependent: 'isDependent',
  relationshipToVeteran: 'relationshipToVeteran',
  veteranIsDeceased: 'veteranIsDeceased',
  branchOfService: 'branchOfService',
  country: 'country',
};

const requireVetRelationship = selectedVeteranStatus =>
  selectedVeteranStatus === 'behalf of vet' ||
  selectedVeteranStatus === 'dependent';

const requireServiceInfo = selectedVeteranStatus =>
  selectedVeteranStatus && selectedVeteranStatus !== 'general';

const contactInformationPage = {
  uiSchema: {
    'ui:description': pageDescription('Your contact info'),
    [formFields.fullName]: fullNameUI,
    [formFields.veteranStatus]: {
      'ui:title': 'My message is about benefits/services',
    },
    [formFields.isDependent]: {
      'ui:title': 'Are you the dependent?',
      'ui:widget': 'yesNo',
      'ui:required': formData => formData.veteranStatus === 'dependent',
      'ui:options': {
        expandUnder: 'veteranStatus',
        expandUnderCondition: 'dependent',
      },
    },
    [formFields.relationshipToVeteran]: {
      'ui:title': 'Your relationship to the Veteran',
      'ui:required': formData => requireVetRelationship(formData.veteranStatus),
      'ui:options': {
        expandUnder: 'veteranStatus',
        expandUnderCondition: requireVetRelationship,
      },
    },
    [formFields.veteranIsDeceased]: {
      'ui:title': 'Is the Veteran deceased?',
      'ui:widget': 'yesNo',
      'ui:required': formData => requireVetRelationship(formData.veteranStatus),
      'ui:options': {
        expandUnder: 'veteranStatus',
        expandUnderCondition: requireVetRelationship,
      },
    },
    [formFields.branchOfService]: {
      'ui:title': 'Branch of service',
      'ui:required': formData => requireServiceInfo(formData.veteranStatus),
      'ui:options': {
        hideIf: formData => !requireServiceInfo(formData.veteranStatus),
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
      formFields.veteranStatus,
      formFields.country,
    ],
    properties: {
      [formFields.fullName]: fullName,
      [formFields.veteranStatus]: veteranStatus,
      [formFields.isDependent]: isDependent,
      [formFields.relationshipToVeteran]: relationshipToVeteran,
      [formFields.veteranIsDeceased]: veteranIsDeceased,
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
