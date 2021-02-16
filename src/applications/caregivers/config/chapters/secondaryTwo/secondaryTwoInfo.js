import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { secondaryCaregiverFields } from 'applications/caregivers/definitions/constants';
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
    'ui:description': SecondaryCaregiverInfo,
    // secondaryTwo UI
    [secondaryCaregiverFields.secondaryTwo.fullName]: fullNameUI(
      secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.ssn]: ssnUI(secondaryTwoInputLabel),
    [secondaryCaregiverFields.secondaryTwo.dateOfBirth]: dateOfBirthUI(
      secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.gender]: genderUI(
      secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.address]: addressWithoutCountryUI(
      secondaryTwoInputLabel,
    ),
  },
  schema: {
    type: 'object',
    required: [
      secondaryCaregiverFields.secondaryTwo.fullName,
      secondaryCaregiverFields.secondaryTwo.dateOfBirth,
    ],
    properties: {
      // secondaryTwo properties
      [secondaryCaregiverFields.secondaryTwo.fullName]:
        secondaryCaregiverTwoProps.fullName,
      [secondaryCaregiverFields.secondaryTwo.ssn]:
        secondaryCaregiverTwoProps.ssnOrTin,
      [secondaryCaregiverFields.secondaryTwo.dateOfBirth]:
        secondaryCaregiverTwoProps.dateOfBirth,
      [secondaryCaregiverFields.secondaryTwo.gender]:
        secondaryCaregiverTwoProps.gender,
    },
  },
};

export default secondaryTwoInfoPage;
