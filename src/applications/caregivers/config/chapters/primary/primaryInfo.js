import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { PrimaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { primaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions from 'applications/caregivers/definitions/caregiverUI';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;
const { dateOfBirthUI, fullNameUI, genderUI, ssnUI } = definitions.sharedItems;
const { primaryCaregiverUI } = definitions;

const primaryInfoPage = {
  uiSchema: {
    'ui:description': () => PrimaryCaregiverInfo({ headerInfo: true }),
    [primaryCaregiverFields.fullName]: fullNameUI(
      primaryCaregiverUI.primaryInputLabel,
    ),
    [primaryCaregiverFields.ssn]: ssnUI(primaryCaregiverUI.primaryInputLabel),
    [primaryCaregiverFields.dateOfBirth]: dateOfBirthUI(
      primaryCaregiverUI.primaryInputLabel,
    ),
    [primaryCaregiverFields.gender]: genderUI(
      primaryCaregiverUI.primaryInputLabel,
    ),
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
