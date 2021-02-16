import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { VetInfo } from 'applications/caregivers/components/AdditionalInfo';
import { vetFields } from 'applications/caregivers/definitions/constants';
import { vetInputLabel } from 'applications/caregivers/definitions/UIDefinitions/veteranUI';

import {
  emailUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  confirmationEmailUI,
  addressWithoutCountryUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const { veteran } = fullSchema.properties;
const veteranProps = veteran.properties;
const { address, phone } = fullSchema.definitions;

const vetContactInfoPage = {
  uiSchema: {
    'ui:description': VetInfo({
      pageTitle: 'Contact information',
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
