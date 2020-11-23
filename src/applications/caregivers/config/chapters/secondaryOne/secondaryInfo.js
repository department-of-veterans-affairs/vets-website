import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { SecondaryCaregiverInfo } from 'applications/caregivers/components/AdditionalInfo';
import { secondaryCaregiverFields } from 'applications/caregivers/definitions/constants';
import definitions from 'applications/caregivers/definitions/caregiverUI';

const { secondaryCaregiverOne } = fullSchema.properties;
const secondaryCaregiverOneProps = secondaryCaregiverOne.properties;

const { dateOfBirthUI, fullNameUI, genderUI, ssnUI } = definitions.sharedItems;

const { secondaryCaregiversUI } = definitions;

const secondaryCaregiverInfoPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverInfo({ headerInfo: true }),
    // secondaryOne UI
    [secondaryCaregiverFields.secondaryOne.fullName]: fullNameUI(
      secondaryCaregiversUI.secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne.ssn]: ssnUI(
      secondaryCaregiversUI.secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne.dateOfBirth]: dateOfBirthUI(
      secondaryCaregiversUI.secondaryOneInputLabel,
    ),
    [secondaryCaregiverFields.secondaryOne.gender]: genderUI(
      secondaryCaregiversUI.secondaryOneInputLabel,
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
