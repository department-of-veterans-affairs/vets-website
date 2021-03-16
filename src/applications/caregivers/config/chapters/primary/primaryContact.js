import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { PrimaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import { primaryInputLabel } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import {
  emailUI,
  vetRelationshipUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithoutCountryUI,
  confirmationEmailUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;
const { address } = fullSchema.definitions;

const primaryContactInfoPage = {
  uiSchema: {
    'ui:description': () =>
      PrimaryCaregiverInfo({ pageTitle: 'Contact information' }),
    [primaryCaregiverFields.address]: addressWithoutCountryUI(
      primaryInputLabel,
    ),
    [primaryCaregiverFields.primaryPhoneNumber]: primaryPhoneNumberUI(
      primaryInputLabel,
    ),
    [primaryCaregiverFields.alternativePhoneNumber]: alternativePhoneNumberUI(
      primaryInputLabel,
    ),
    [primaryCaregiverFields.email]: emailUI(primaryInputLabel),
    [primaryCaregiverFields.verifyEmail]: confirmationEmailUI(
      primaryInputLabel,
      primaryCaregiverFields.email,
    ),
    [primaryCaregiverFields.vetRelationship]: vetRelationshipUI(
      primaryInputLabel,
    ),
  },
  schema: {
    type: 'object',
    required: [
      primaryCaregiverFields.address,
      primaryCaregiverFields.primaryPhoneNumber,
      primaryCaregiverFields.vetRelationship,
    ],
    properties: {
      [primaryCaregiverFields.address]: address,
      [primaryCaregiverFields.primaryPhoneNumber]:
        primaryCaregiverProps.primaryPhoneNumber,
      [primaryCaregiverFields.alternativePhoneNumber]:
        primaryCaregiverProps.alternativePhoneNumber,
      [primaryCaregiverFields.email]: primaryCaregiverProps.email,
      [primaryCaregiverFields.verifyEmail]: primaryCaregiverProps.email,
      [primaryCaregiverFields.vetRelationship]:
        primaryCaregiverProps.vetRelationship,
    },
  },
};

export default primaryContactInfoPage;
