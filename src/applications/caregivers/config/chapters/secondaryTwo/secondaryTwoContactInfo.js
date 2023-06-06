import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import {
  secondaryTwoFields,
  emptyObjectSchema,
} from '../../../definitions/constants';
import { secondaryTwoContactIntro } from '../../../definitions/content';
import {
  emailUI,
  vetRelationshipUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithAutofillUI,
  emailEncouragementUI,
} from '../../../definitions/UIDefinitions/sharedUI';
import { secondaryTwoInputLabel } from '../../../definitions/UIDefinitions/caregiverUI';
import SecondaryCaregiverDescription from '../../../components/FormDescriptions/SecondaryCaregiverDescription';

const { address } = fullSchema.definitions;
const { secondaryCaregiverTwo } = fullSchema.properties;
const secondaryCaregiverTwoProps = secondaryCaregiverTwo.properties;

const secondaryTwoContactPage = {
  uiSchema: {
    'ui:description': formContext =>
      SecondaryCaregiverDescription({
        formContext,
        pageTitle: 'Secondary Family Caregiver contact information',
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
    [secondaryTwoFields.emailEncouragementMessage]: emailEncouragementUI(),
    [secondaryTwoFields.email]: emailUI(secondaryTwoInputLabel),
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
      [secondaryTwoFields.emailEncouragementMessage]: emptyObjectSchema,
      [secondaryTwoFields.email]: secondaryCaregiverTwoProps.email,
      [secondaryTwoFields.vetRelationship]:
        secondaryCaregiverTwoProps.vetRelationship,
    },
  },
};

export default secondaryTwoContactPage;
