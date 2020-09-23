import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { secondaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions, {
  addressWithoutCountryUI,
} from 'applications/caregivers/definitions/caregiverUI';

const { secondaryCaregiverTwo } = fullSchema.properties;
const secondaryCaregiverTwoProps = secondaryCaregiverTwo.properties;
const { dateOfBirthUI, fullNameUI, genderUI, ssnUI } = definitions.sharedItems;

const { secondaryCaregiversUI } = definitions;

const secondaryTwoInfoPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverInfo,
    // secondaryTwo UI
    [secondaryCaregiverFields.secondaryTwo.fullName]: fullNameUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.ssn]: ssnUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.dateOfBirth]: dateOfBirthUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.gender]: genderUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
    ),
    [secondaryCaregiverFields.secondaryTwo.address]: addressWithoutCountryUI(
      secondaryCaregiversUI.secondaryTwoInputLabel,
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
