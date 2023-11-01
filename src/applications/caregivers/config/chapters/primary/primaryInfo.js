import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { primaryCaregiverFields } from '../../../definitions/constants';
import {
  dobUI,
  fullNameUI,
  customFieldSchemaUI,
  genderUI,
  ssnUI,
} from '../../../definitions/UIDefinitions/sharedUI';
import { primaryInputLabel } from '../../../definitions/UIDefinitions/caregiverUI';
import { CaregiverFullNameDescription } from '../../../components/FormDescriptions';
import PrimaryCaregiverDescription from '../../../components/FormDescriptions/PrimaryCaregiverDescription';

const { primaryCaregiver } = fullSchema.properties;
const primaryCaregiverProps = primaryCaregiver.properties;
// Initialize fullNameUI with originalUI
let extendedNameUI = fullNameUI(primaryInputLabel);
// Add/replace whatever key/values needed
extendedNameUI = customFieldSchemaUI(
  extendedNameUI,
  'first',
  'ui:description',
  CaregiverFullNameDescription,
);

const primaryInfoPage = {
  uiSchema: {
    'ui:description': PrimaryCaregiverDescription({ showPageIntro: true }),
    [primaryCaregiverFields.fullName]: extendedNameUI,
    [primaryCaregiverFields.ssn]: ssnUI(primaryInputLabel),
    [primaryCaregiverFields.dateOfBirth]: dobUI(primaryInputLabel),
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
