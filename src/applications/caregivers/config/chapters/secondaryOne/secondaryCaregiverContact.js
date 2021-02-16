import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { secondaryCaregiverFields } from 'applications/caregivers/definitions/constants';
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
    [secondaryCaregiverFields.secondaryOne.address]: addressWithoutCountryUI(
      secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne
      .primaryPhoneNumber]: primaryPhoneNumberUI(secondaryOneInputLabel),
    [secondaryCaregiverFields.secondaryOne
      .alternativePhoneNumber]: alternativePhoneNumberUI(
      secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne.email]: emailUI(
      secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne.verifyEmail]: confirmationEmailUI(
      secondaryOneInputLabel,
      secondaryCaregiverFields.secondaryOne.email,
    ),
    [secondaryCaregiverFields.secondaryOne.vetRelationship]: vetRelationshipUI(
      secondaryOneInputLabel,
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
