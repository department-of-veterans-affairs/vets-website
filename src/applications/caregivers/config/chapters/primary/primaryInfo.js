import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { primaryCaregiverFields } from '../../../definitions/constants';
import {
  dateOfBirthUI,
  fullNameUI,
  genderUI,
  ssnUI,
} from '../../../definitions/UIDefinitions/sharedUI';
import { primaryInputLabel } from '../../../definitions/UIDefinitions/caregiverUI';
import PrimaryCaregiverDescription from '../../../components/FormDescriptions/PrimaryCaregiverDescription';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;

const primaryInfoPage = {
  uiSchema: {
    'ui:description': PrimaryCaregiverDescription({ showPageIntro: true }),
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
