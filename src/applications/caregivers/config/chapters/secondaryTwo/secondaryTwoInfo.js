import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { secondaryTwoFields } from 'applications/caregivers/definitions/constants';
import { secondaryTwoHeaderInfo } from 'applications/caregivers/definitions/content';
import { secondaryTwoInputLabel } from 'applications/caregivers/definitions/UIDefinitions/caregiverUI';
import {
  ssnUI,
  genderUI,
  fullNameUI,
  dateOfBirthUI,
  addressWithoutCountryUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const { secondaryCaregiverTwo } = fullSchema.properties;
const secondaryCaregiverTwoProps = secondaryCaregiverTwo.properties;

const secondaryTwoInfoPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverInfo({
      headerInfo: secondaryTwoHeaderInfo,
    }),
    // secondaryTwo UI
    [secondaryTwoFields.fullName]: fullNameUI(secondaryTwoInputLabel),
    [secondaryTwoFields.ssn]: ssnUI(secondaryTwoInputLabel),
    [secondaryTwoFields.dateOfBirth]: dateOfBirthUI(secondaryTwoInputLabel),
    [secondaryTwoFields.gender]: genderUI(secondaryTwoInputLabel),
    [secondaryTwoFields.address]: addressWithoutCountryUI(
      secondaryTwoInputLabel,
    ),
  },
  schema: {
    type: 'object',
    required: [secondaryTwoFields.fullName, secondaryTwoFields.dateOfBirth],
    properties: {
      // secondaryTwo properties
      [secondaryTwoFields.fullName]: secondaryCaregiverTwoProps.fullName,
      [secondaryTwoFields.ssn]: secondaryCaregiverTwoProps.ssnOrTin,
      [secondaryTwoFields.dateOfBirth]: secondaryCaregiverTwoProps.dateOfBirth,
      [secondaryTwoFields.gender]: secondaryCaregiverTwoProps.gender,
    },
  },
};

export default secondaryTwoInfoPage;
