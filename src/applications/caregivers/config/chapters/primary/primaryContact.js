import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import confirmationEmailUI from 'platform/forms-system/src/js/definitions/confirmationEmail';
import {
  primaryCaregiverFields,
  emptyObjectSchema,
} from '../../../definitions/constants';
import {
  emailUI,
  vetRelationshipUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithAutofillUI,
  emailEncouragementUI,
} from '../../../definitions/UIDefinitions/sharedUI';
import { primaryInputLabel } from '../../../definitions/UIDefinitions/caregiverUI';
import PrimaryCaregiverDescription from '../../../components/FormDescriptions/PrimaryCaregiverDescription';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;
const { address } = fullSchema.definitions;

const primaryContactInfoPage = {
  uiSchema: {
    'ui:description': formContext =>
      PrimaryCaregiverDescription({
        formContext,
        pageTitle: 'Primary Family Caregiver contact information',
        showContactIntro: true,
      }),
    [primaryCaregiverFields.address]: addressWithAutofillUI(),
    [primaryCaregiverFields.primaryPhoneNumber]: primaryPhoneNumberUI(
      primaryInputLabel,
    ),
    [primaryCaregiverFields.alternativePhoneNumber]: alternativePhoneNumberUI(
      primaryInputLabel,
    ),
    [primaryCaregiverFields.emailEncouragementMessage]: emailEncouragementUI(),
    [primaryCaregiverFields.email]: emailUI(primaryInputLabel),
    [primaryCaregiverFields.verifyEmail]: confirmationEmailUI(
      primaryInputLabel,
      primaryCaregiverFields.email,
    ),
    [primaryCaregiverFields.vetRelationship]: vetRelationshipUI(
      primaryInputLabel,
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
      [primaryCaregiverFields.address]: {
        ...address,
        properties: {
          ...address.properties,
          'view:autofill': { type: 'boolean' },
        },
      },
      [primaryCaregiverFields.primaryPhoneNumber]:
        primaryCaregiverProps.primaryPhoneNumber,
      [primaryCaregiverFields.alternativePhoneNumber]:
        primaryCaregiverProps.alternativePhoneNumber,
      [primaryCaregiverFields.emailEncouragementMessage]: emptyObjectSchema,
      [primaryCaregiverFields.email]: primaryCaregiverProps.email,
      [primaryCaregiverFields.verifyEmail]: primaryCaregiverProps.email,
      [primaryCaregiverFields.vetRelationship]:
        primaryCaregiverProps.vetRelationship,
    },
  },
};

export default primaryContactInfoPage;
