import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import confirmationEmailUI from 'platform/forms-system/src/js/definitions/confirmationEmail';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo/SecondaryCaregiverInfo';
import { secondaryOneFields } from 'applications/caregivers/definitions/constants';
import { secondaryOneContactIntro } from 'applications/caregivers/definitions/content';
import {
  secondaryOneInputLabel,
  hasSecondaryCaregiverTwoUI,
} from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import {
  emailUI,
  vetRelationshipUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithAutofillUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const { secondaryCaregiverOne } = fullSchema.properties;
const secondaryCaregiverOneProps = secondaryCaregiverOne.properties;
const { address } = fullSchema.definitions;

const secondaryCaregiverContactPage = {
  uiSchema: {
    'ui:description': formContext =>
      SecondaryCaregiverInfo({
        formContext,
        pageTitle: 'Contact information',
        introText: secondaryOneContactIntro,
        showContactIntro: true,
      }),
    [secondaryOneFields.address]: addressWithAutofillUI(),
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
      [secondaryOneFields.address]: {
        ...address,
        properties: {
          ...address.properties,
          'view:autofill': { type: 'boolean' },
        },
      },
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
