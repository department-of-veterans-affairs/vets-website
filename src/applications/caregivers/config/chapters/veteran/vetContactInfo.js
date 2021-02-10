import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { VetInfo } from 'applications/caregivers/components/AdditionalInfo';
import { vetFields } from 'applications/caregivers/definitions/constants';
import definitions, {
  addressWithoutCountryUI,
  confirmationEmailUI,
  vetInputLabel,
} from 'applications/caregivers/definitions/caregiverUI';

const { veteran } = fullSchema.properties;
const veteranProps = veteran.properties;
const { address, phone } = fullSchema.definitions;
const {
  alternativePhoneNumberUI,
  emailUI,
  primaryPhoneNumberUI,
  contactInfoTitle,
} = definitions.sharedItems;

const vetContactInfoPage = {
  uiSchema: {
    'ui:description': VetInfo({
      pageTitle: contactInfoTitle,
      headerInfo: true,
    }),
    [vetFields.address]: addressWithoutCountryUI(vetInputLabel),
    [vetFields.primaryPhoneNumber]: primaryPhoneNumberUI(vetInputLabel),
    [vetFields.alternativePhoneNumber]: alternativePhoneNumberUI(vetInputLabel),
    [vetFields.email]: emailUI(vetInputLabel),
    [vetFields.verifyEmail]: confirmationEmailUI(
      vetInputLabel,
      vetFields.email,
    ),
  },
  schema: {
    type: 'object',
    required: [vetFields.address, vetFields.primaryPhoneNumber],
    properties: {
      [vetFields.address]: address,
      [vetFields.primaryPhoneNumber]: phone,
      [vetFields.alternativePhoneNumber]: phone,
      [vetFields.email]: veteranProps.email,
      [vetFields.verifyEmail]: veteranProps.email,
    },
  },
};

export default vetContactInfoPage;
