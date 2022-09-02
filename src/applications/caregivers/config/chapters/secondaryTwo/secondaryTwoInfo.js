import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { secondaryTwoFields } from '../../../definitions/constants';
import { secondaryTwoPageIntro } from '../../../definitions/content';
import {
  ssnUI,
  genderUI,
  fullNameUI,
  dateOfBirthUI,
  addressWithoutCountryUI,
} from '../../../definitions/UIDefinitions/sharedUI';
import { secondaryTwoInputLabel } from '../../../definitions/UIDefinitions/caregiverUI';
import SecondaryCaregiverDescription from '../../../components/FormDescriptions/SecondaryCaregiverDescription';

const { secondaryCaregiverTwo } = fullSchema.properties;
const secondaryCaregiverTwoProps = secondaryCaregiverTwo.properties;

const secondaryTwoInfoPage = {
  uiSchema: {
    'ui:description': SecondaryCaregiverDescription({
      introText: secondaryTwoPageIntro,
      showPageIntro: true,
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
