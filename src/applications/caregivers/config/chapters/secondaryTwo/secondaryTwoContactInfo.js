import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { secondaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import { secondaryTwoInputLabel } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import {
  emailUI,
  vetRelationshipUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithoutCountryUI,
  confirmationEmailUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const { secondaryCaregiverTwo } = fullSchema.properties;
const secondaryCaregiverTwoProps = secondaryCaregiverTwo.properties;

const { address } = fullSchema.definitions;

const secondaryTwoContactPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverInfo({
      pageTitle: 'Contact information',
    }),
    // secondaryTwo UI
    [secondaryCaregiverFields.secondaryTwo.address]: addressWithoutCountryUI(
      secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo
      .primaryPhoneNumber]: primaryPhoneNumberUI(secondaryTwoInputLabel),
    [secondaryCaregiverFields.secondaryTwo
      .alternativePhoneNumber]: alternativePhoneNumberUI(
      secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.email]: emailUI(
      secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.verifyEmail]: confirmationEmailUI(
      secondaryTwoInputLabel,
      secondaryCaregiverFields.secondaryTwo.email,
    ),
    [secondaryCaregiverFields.secondaryTwo.vetRelationship]: vetRelationshipUI(
      secondaryTwoInputLabel,
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
