import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { VetInfo } from 'applications/caregivers/components/AdditionalInfo';
import { vetFields } from 'applications/caregivers/definitions/constants';
import definitions, {
  vetInputLabel,
} from 'applications/caregivers/definitions/caregiverUI';

const { veteran } = fullSchema.properties;
const veteranProps = veteran.properties;
const { dateOfBirthUI, fullNameUI, genderUI, ssnUI } = definitions.sharedItems;

const vetInfoPage = {
  uiSchema: {
    'ui:description': VetInfo({ headerInfo: true }),
    [vetFields.fullName]: fullNameUI(vetInputLabel),
    [vetFields.ssn]: ssnUI(vetInputLabel),
    [vetFields.dateOfBirth]: dateOfBirthUI(vetInputLabel),
    [vetFields.gender]: genderUI(vetInputLabel),
  },
  schema: {
    type: 'object',
    required: [vetFields.dateOfBirth, vetFields.fullName, vetFields.ssn],
    properties: {
      [vetFields.fullName]: veteranProps.fullName,
      [vetFields.ssn]: veteranProps.ssnOrTin,
      [vetFields.dateOfBirth]: veteranProps.dateOfBirth,
      [vetFields.gender]: veteranProps.gender,
    },
  },
};

export default vetInfoPage;
