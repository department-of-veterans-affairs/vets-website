import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { PrimaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions, {
  primaryInputLabel,
} from 'applications/caregivers/definitions/caregiverUI';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;
const { dateOfBirthUI, fullNameUI, genderUI, ssnUI } = definitions.sharedItems;

const primaryInfoPage = {
  uiSchema: {
    'ui:description': () => PrimaryCaregiverInfo({ headerInfo: true }),
    [primaryCaregiverFields.fullName]: fullNameUI(primaryInputLabel),
    [primaryCaregiverFields.ssn]: ssnUI(primaryInputLabel),
    [primaryCaregiverFields.dateOfBirth]: dateOfBirthUI(primaryInputLabel),
    [primaryCaregiverFields.gender]: genderUI(primaryInputLabel),
  },
  schema: {
    type: 'object',
    required: [
      primaryCaregiverFields.fullName,
      primaryCaregiverFields.dateOfBirth,
    ],
    properties: {
      [primaryCaregiverFields.fullName]: primaryCaregiverProps.fullName,
      [primaryCaregiverFields.ssn]: primaryCaregiverProps.ssnOrTin,
      [primaryCaregiverFields.dateOfBirth]: primaryCaregiverProps.dateOfBirth,
      [primaryCaregiverFields.gender]: primaryCaregiverProps.gender,
    },
  },
};

export default primaryInfoPage;
