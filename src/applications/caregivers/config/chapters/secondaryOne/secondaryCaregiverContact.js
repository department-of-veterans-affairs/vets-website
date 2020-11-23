import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { secondaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions, {
  addressWithoutCountryUI,
  confirmationEmailUI,
} from 'applications/caregivers/definitions/caregiverUI';

const { secondaryCaregiverOne } = fullSchema.properties;
const secondaryCaregiverOneProps = secondaryCaregiverOne.properties;

const { address } = fullSchema.definitions;

const {
  alternativePhoneNumberUI,
  emailUI,
  hasSecondaryCaregiverTwoUI,
  primaryPhoneNumberUI,
  vetRelationshipUI,
  contactInfoTitle,
} = definitions.sharedItems;

const { secondaryCaregiversUI } = definitions;

const secondaryCaregiverContactPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverInfo({
      pageTitle: contactInfoTitle,
    }),
    // secondaryOne UI
    [secondaryCaregiverFields.secondaryOne.address]: addressWithoutCountryUI(
      secondaryCaregiversUI.secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne
      .primaryPhoneNumber]: primaryPhoneNumberUI(
      secondaryCaregiversUI.secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne
      .alternativePhoneNumber]: alternativePhoneNumberUI(
      secondaryCaregiversUI.secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne.email]: emailUI(
      secondaryCaregiversUI.secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne.verifyEmail]: confirmationEmailUI(
      secondaryCaregiversUI.secondaryOneInputLabel,
      secondaryCaregiverFields.secondaryOne.email,
    ),
    [secondaryCaregiverFields.secondaryOne.vetRelationship]: vetRelationshipUI(
      secondaryCaregiversUI.secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne
      .hasSecondaryCaregiverTwo]: hasSecondaryCaregiverTwoUI,
  },
  schema: {
    type: 'object',
    required: [
      secondaryCaregiverFields.secondaryOne.address,
      secondaryCaregiverFields.secondaryOne.vetRelationship,
      secondaryCaregiverFields.secondaryOne.primaryPhoneNumber,
    ],
    properties: {
      // secondaryOne properties
      [secondaryCaregiverFields.secondaryOne.address]: address,
      [secondaryCaregiverFields.secondaryOne.primaryPhoneNumber]:
        secondaryCaregiverOneProps.primaryPhoneNumber,
      [secondaryCaregiverFields.secondaryOne.alternativePhoneNumber]:
        secondaryCaregiverOneProps.alternativePhoneNumber,
      [secondaryCaregiverFields.secondaryOne.email]:
        secondaryCaregiverOneProps.email,
      [secondaryCaregiverFields.secondaryOne.verifyEmail]:
        secondaryCaregiverOneProps.email,
      [secondaryCaregiverFields.secondaryOne.vetRelationship]:
        secondaryCaregiverOneProps.vetRelationship,
      [secondaryCaregiverFields.secondaryOne.hasSecondaryCaregiverTwo]: {
        type: 'boolean',
      },
    },
  },
};

export default secondaryCaregiverContactPage;
