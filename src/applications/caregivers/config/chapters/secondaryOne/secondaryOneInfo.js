import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { secondaryOneFields } from '../../../definitions/constants';
import { secondaryOnePageIntro } from '../../../definitions/content';
import {
  dobUI,
  fullNameUI,
  customFieldSchemaUI,
  genderUI,
  ssnUI,
} from '../../../definitions/UIDefinitions/sharedUI';
import { secondaryOneInputLabel } from '../../../definitions/UIDefinitions/caregiverUI';
import { CaregiverFullNameDescription } from '../../../components/FormDescriptions';
import SecondaryCaregiverDescription from '../../../components/FormDescriptions/SecondaryCaregiverDescription';

const { secondaryCaregiverOne } = fullSchema.properties;
const secondaryCaregiverOneProps = secondaryCaregiverOne.properties;
// Initialize fullNameUI with originalUI
let extendedNameUI = fullNameUI(secondaryOneInputLabel);
// Add/replace whatever key/values needed
extendedNameUI = customFieldSchemaUI(
  extendedNameUI,
  'first',
  'ui:description',
  CaregiverFullNameDescription,
);

const secondaryCaregiverInfoPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverDescription({
      introText: secondaryOnePageIntro,
      showPageIntro: true,
    }),
    // secondaryOne UI
    [secondaryOneFields.fullName]: extendedNameUI,
    [secondaryOneFields.ssn]: ssnUI(secondaryOneInputLabel),
    [secondaryOneFields.dateOfBirth]: dobUI(secondaryOneInputLabel),
    [secondaryOneFields.gender]: genderUI(secondaryOneInputLabel),
  },
  schema: {
    type: 'object',
    required: [secondaryOneFields.fullName, secondaryOneFields.dateOfBirth],
    properties: {
      // secondaryOne properties
      [secondaryOneFields.fullName]: secondaryCaregiverOneProps.fullName,
      [secondaryOneFields.ssn]: secondaryCaregiverOneProps.ssnOrTin,
      [secondaryOneFields.dateOfBirth]: secondaryCaregiverOneProps.dateOfBirth,
      [secondaryOneFields.gender]: secondaryCaregiverOneProps.gender,
    },
  },
};

export default secondaryCaregiverInfoPage;
