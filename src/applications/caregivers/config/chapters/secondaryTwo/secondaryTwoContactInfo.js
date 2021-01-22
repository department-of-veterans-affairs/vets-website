import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { secondaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions, {
  addressWithoutCountryUI,
  confirmationEmailUI,
} from 'applications/caregivers/definitions/caregiverUI';

const { secondaryCaregiverTwo } = fullSchema.properties;
const secondaryCaregiverTwoProps = secondaryCaregiverTwo.properties;

const { address } = fullSchema.definitions;

const {
  alternativePhoneNumberUI,
  emailUI,
  primaryPhoneNumberUI,
  vetRelationshipUI,
  contactInfoTitle,
} = definitions.sharedItems;

const { secondaryCaregiversUI } = definitions;

const secondaryTwoContactPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverInfo({
      pageTitle: contactInfoTitle,
    }),
    // secondaryTwo UI
    [secondaryCaregiverFields.secondaryTwo.address]: addressWithoutCountryUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo
      .primaryPhoneNumber]: primaryPhoneNumberUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo
      .alternativePhoneNumber]: alternativePhoneNumberUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.email]: emailUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.verifyEmail]: confirmationEmailUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
      secondaryCaregiverFields.secondaryTwo.email,
    ),
    [secondaryCaregiverFields.secondaryTwo.vetRelationship]: vetRelationshipUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
    ),
  },
  schema: {
    type: 'object',
    required: [
      secondaryCaregiverFields.secondaryTwo.address,
      secondaryCaregiverFields.secondaryTwo.primaryPhoneNumber,
      secondaryCaregiverFields.secondaryTwo.vetRelationship,
    ],
    properties: {
      // secondaryTwo properties
      [secondaryCaregiverFields.secondaryTwo.address]: address,
      [secondaryCaregiverFields.secondaryTwo.primaryPhoneNumber]:
        secondaryCaregiverTwoProps.primaryPhoneNumber,
      [secondaryCaregiverFields.secondaryTwo.alternativePhoneNumber]:
        secondaryCaregiverTwoProps.alternativePhoneNumber,
      [secondaryCaregiverFields.secondaryTwo.email]:
        secondaryCaregiverTwoProps.email,
      [secondaryCaregiverFields.secondaryTwo.verifyEmail]:
        secondaryCaregiverTwoProps.email,
      [secondaryCaregiverFields.secondaryTwo.vetRelationship]:
        secondaryCaregiverTwoProps.vetRelationship,
    },
  },
};

export default secondaryTwoContactPage;
