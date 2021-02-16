import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { secondaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import { secondaryOneInputLabel } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import {
  dateOfBirthUI,
  fullNameUI,
  genderUI,
  ssnUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const { secondaryCaregiverOne } = fullSchema.properties;
const secondaryCaregiverOneProps = secondaryCaregiverOne.properties;

const secondaryCaregiverInfoPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverInfo({ headerInfo: true }),
    // secondaryOne UI
    [secondaryCaregiverFields.secondaryOne.fullName]: fullNameUI(
      secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne.ssn]: ssnUI(secondaryOneInputLabel),
    [secondaryCaregiverFields.secondaryOne.dateOfBirth]: dateOfBirthUI(
      secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne.gender]: genderUI(
      secondaryOneInputLabel,
    ),
  },
  schema: {
    type: 'object',
    required: [
      secondaryCaregiverFields.secondaryOne.fullName,
      secondaryCaregiverFields.secondaryOne.dateOfBirth,
    ],
    properties: {
      // secondaryOne properties
      [secondaryCaregiverFields.secondaryOne.fullName]:
        secondaryCaregiverOneProps.fullName,
      [secondaryCaregiverFields.secondaryOne.ssn]:
        secondaryCaregiverOneProps.ssnOrTin,
      [secondaryCaregiverFields.secondaryOne.dateOfBirth]:
        secondaryCaregiverOneProps.dateOfBirth,
      [secondaryCaregiverFields.secondaryOne.gender]:
        secondaryCaregiverOneProps.gender,
    },
  },
};

export default secondaryCaregiverInfoPage;
