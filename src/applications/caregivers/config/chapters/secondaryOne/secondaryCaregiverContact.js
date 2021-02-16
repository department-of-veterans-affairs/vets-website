import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { secondaryOneFields } from 'applications/caregivers/definitions/constants';
import {
  secondaryOneInputLabel,
  hasSecondaryCaregiverTwoUI,
} from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import {
  emailUI,
  vetRelationshipUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithoutCountryUI,
  confirmationEmailUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const { secondaryCaregiverOne } = fullSchema.properties;
const secondaryCaregiverOneProps = secondaryCaregiverOne.properties;

const { address } = fullSchema.definitions;

const secondaryCaregiverContactPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverInfo({
      pageTitle: 'Contact information',
    }),
    // secondaryOne UI
    [secondaryOneFields.address]: addressWithoutCountryUI(
      secondaryOneInputLabel,
    ),
    [secondaryOneFields.primaryPhoneNumber]: primaryPhoneNumberUI(
      secondaryOneInputLabel,
    ),
    [secondaryOneFields.alternativePhoneNumber]: alternativePhoneNumberUI(
      secondaryOneInputLabel,
    ),
    [secondaryOneFields.email]: emailUI(secondaryOneInputLabel),
    [secondaryOneFields.verifyEmail]: confirmationEmailUI(
      secondaryOneInputLabel,
      secondaryOneFields.email,
    ),
    [secondaryOneFields.vetRelationship]: vetRelationshipUI(
      secondaryOneInputLabel,
    ),
    [secondaryOneFields.hasSecondaryCaregiverTwo]: hasSecondaryCaregiverTwoUI,
  },
  schema: {
    type: 'object',
    required: [
      secondaryOneFields.address,
      secondaryOneFields.vetRelationship,
      secondaryOneFields.primaryPhoneNumber,
    ],
    properties: {
      // secondaryOne properties
      [secondaryOneFields.address]: address,
      [secondaryOneFields.primaryPhoneNumber]:
        secondaryCaregiverOneProps.primaryPhoneNumber,
      [secondaryOneFields.alternativePhoneNumber]:
        secondaryCaregiverOneProps.alternativePhoneNumber,
      [secondaryOneFields.email]: secondaryCaregiverOneProps.email,
      [secondaryOneFields.verifyEmail]: secondaryCaregiverOneProps.email,
      [secondaryOneFields.vetRelationship]:
        secondaryCaregiverOneProps.vetRelationship,
      [secondaryOneFields.hasSecondaryCaregiverTwo]: {
        type: 'boolean',
      },
    },
  },
};

export default secondaryCaregiverContactPage;
