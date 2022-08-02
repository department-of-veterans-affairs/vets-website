import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { PrimaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo/PrimaryCaregiverInfo';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import { primaryInputLabel } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import confirmationEmailUI from 'platform/forms-system/src/js/definitions/confirmationEmail';
import {
  emailUI,
  vetRelationshipUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithAutofillUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;
const { address } = fullSchema.definitions;

const primaryContactInfoPage = {
  uiSchema: {
    'ui:description': formContext =>
      PrimaryCaregiverInfo({
        formContext,
        pageTitle: 'Contact information',
        showContactIntro: true,
      }),
    [primaryCaregiverFields.address]: addressWithAutofillUI(),
    [primaryCaregiverFields.primaryPhoneNumber]: primaryPhoneNumberUI(
      primaryInputLabel,
    ),
    [primaryCaregiverFields.alternativePhoneNumber]: alternativePhoneNumberUI(
      primaryInputLabel,
    ),
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
      [primaryCaregiverFields.email]: primaryCaregiverProps.email,
      [primaryCaregiverFields.verifyEmail]: primaryCaregiverProps.email,
      [primaryCaregiverFields.vetRelationship]:
        primaryCaregiverProps.vetRelationship,
    },
  },
};

export default primaryContactInfoPage;
