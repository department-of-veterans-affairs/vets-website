import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { PrimaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions, {
  addressWithoutCountryUI,
  confirmationEmailUI,
} from 'applications/caregivers/definitions/caregiverUI';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;
const { address } = fullSchema.definitions;
const { primaryCaregiverUI } = definitions;

const {
  alternativePhoneNumberUI,
  emailUI,
  primaryPhoneNumberUI,
  vetRelationshipUI,
  contactInfoTitle,
} = definitions.sharedItems;

const primaryContactInfoPage = {
  uiSchema: {
    'ui:description': () =>
      PrimaryCaregiverInfo({ pageTitle: contactInfoTitle }),
    [primaryCaregiverFields.address]: addressWithoutCountryUI(
      primaryCaregiverUI.primaryInputLabel,
    ),
    [primaryCaregiverFields.primaryPhoneNumber]: primaryPhoneNumberUI(
      primaryCaregiverUI.primaryInputLabel,
    ),
    [primaryCaregiverFields.alternativePhoneNumber]: alternativePhoneNumberUI(
      primaryCaregiverUI.primaryInputLabel,
    ),
    [primaryCaregiverFields.email]: emailUI(
      primaryCaregiverUI.primaryInputLabel,
    ),
    [primaryCaregiverFields.verifyEmail]: confirmationEmailUI(
      primaryCaregiverUI.primaryInputLabel,
      primaryCaregiverFields.email,
    ),
    [primaryCaregiverFields.vetRelationship]: vetRelationshipUI(
      primaryCaregiverUI.primaryInputLabel,
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
