import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import confirmationEmailUI from 'platform/forms-system/src/js/definitions/confirmationEmail';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo/SecondaryCaregiverInfo';
import { secondaryTwoFields } from 'applications/caregivers/definitions/constants';
import { secondaryTwoContactIntro } from 'applications/caregivers/definitions/content';
import { secondaryTwoInputLabel } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import {
  emailUI,
  vetRelationshipUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithAutofillUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const { secondaryCaregiverTwo } = fullSchema.properties;
const secondaryCaregiverTwoProps = secondaryCaregiverTwo.properties;

const { address } = fullSchema.definitions;

const secondaryTwoContactPage = {
  uiSchema: {
    'ui:description': formContext =>
      SecondaryCaregiverInfo({
        formContext,
        pageTitle: 'Contact information',
        introText: secondaryTwoContactIntro,
        showContactIntro: true,
      }),
    [secondaryTwoFields.address]: addressWithAutofillUI(),
    [secondaryTwoFields.primaryPhoneNumber]: primaryPhoneNumberUI(
      secondaryTwoInputLabel,
    ),
    [secondaryTwoFields.alternativePhoneNumber]: alternativePhoneNumberUI(
      secondaryTwoInputLabel,
    ),
    [secondaryTwoFields.email]: emailUI(secondaryTwoInputLabel),
    [secondaryTwoFields.verifyEmail]: confirmationEmailUI(
      secondaryTwoInputLabel,
      secondaryTwoFields.email,
    ),
    [secondaryTwoFields.vetRelationship]: vetRelationshipUI(
      secondaryTwoInputLabel,
    ),
  },
  schema: {
    type: 'object',
    required: [
      secondaryTwoFields.address,
      secondaryTwoFields.primaryPhoneNumber,
      secondaryTwoFields.vetRelationship,
    ],
    properties: {
      [secondaryTwoFields.address]: {
        ...address,
        properties: {
          ...address.properties,
          'view:autofill': { type: 'boolean' },
        },
      },
      [secondaryTwoFields.primaryPhoneNumber]:
        secondaryCaregiverTwoProps.primaryPhoneNumber,
      [secondaryTwoFields.alternativePhoneNumber]:
        secondaryCaregiverTwoProps.alternativePhoneNumber,
      [secondaryTwoFields.email]: secondaryCaregiverTwoProps.email,
      [secondaryTwoFields.verifyEmail]: secondaryCaregiverTwoProps.email,
      [secondaryTwoFields.vetRelationship]:
        secondaryCaregiverTwoProps.vetRelationship,
    },
  },
};

export default secondaryTwoContactPage;
