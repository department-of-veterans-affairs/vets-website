import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { secondaryOneFields } from 'applications/caregivers/definitions/constants';
import { secondaryOneInputLabel } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import { secondaryOnePageIntro } from 'applications/caregivers/definitions/content';
import {
  dateOfBirthUI,
  fullNameUI,
  genderUI,
  ssnUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
import SecondaryCaregiverDescription from 'applications/caregivers/components/FormDescriptions/SecondaryCaregiverDescription';

const { secondaryCaregiverOne } = fullSchema.properties;
const secondaryCaregiverOneProps = secondaryCaregiverOne.properties;

const secondaryCaregiverInfoPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverDescription({
      introText: secondaryOnePageIntro,
      showPageIntro: true,
    }),
    // secondaryOne UI
    [secondaryOneFields.fullName]: fullNameUI(secondaryOneInputLabel),
    [secondaryOneFields.ssn]: ssnUI(secondaryOneInputLabel),
    [secondaryOneFields.dateOfBirth]: dateOfBirthUI(secondaryOneInputLabel),
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
