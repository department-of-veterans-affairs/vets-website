import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import {
  secondaryOneFields,
  emptyObjectSchema,
} from '../../../definitions/constants';
import { secondaryOneContactIntro } from '../../../definitions/content';
import {
  emailUI,
  vetRelationshipUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithAutofillUI,
  emailEncouragementUI,
} from '../../../definitions/UIDefinitions/sharedUI';
import {
  secondaryOneInputLabel,
  hasSecondaryCaregiverTwoUI,
} from '../../../definitions/UIDefinitions/caregiverUI';
import SecondaryCaregiverDescription from '../../../components/FormDescriptions/SecondaryCaregiverDescription';

const { address } = fullSchema.definitions;
const { secondaryCaregiverOne } = fullSchema.properties;
const secondaryCaregiverOneProps = secondaryCaregiverOne.properties;

const secondaryCaregiverContactPage = {
  uiSchema: {
    'ui:description': formContext =>
      SecondaryCaregiverDescription({
        formContext,
        pageTitle: 'Secondary Family Caregiver contact information',
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
    [secondaryOneFields.emailEncouragementMessage]: emailEncouragementUI(),
    [secondaryOneFields.email]: emailUI(secondaryOneInputLabel),
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
      [secondaryOneFields.emailEncouragementMessage]: emptyObjectSchema,
      [secondaryOneFields.email]: secondaryCaregiverOneProps.email,
      [secondaryOneFields.vetRelationship]:
        secondaryCaregiverOneProps.vetRelationship,
      [secondaryOneFields.hasSecondaryCaregiverTwo]: {
        type: 'boolean',
      },
    },
  },
};

export default secondaryCaregiverContactPage;
