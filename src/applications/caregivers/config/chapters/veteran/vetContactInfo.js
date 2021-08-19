import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { VetInfo } from 'applications/caregivers/components/AdditionalInfo';
import { veteranFields } from 'applications/caregivers/definitions/constants';
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
    [veteranFields.address]: addressWithoutCountryUI(vetInputLabel),
    [veteranFields.primaryPhoneNumber]: primaryPhoneNumberUI(vetInputLabel),
    [veteranFields.alternativePhoneNumber]: alternativePhoneNumberUI(
      vetInputLabel,
    ),
    [veteranFields.email]: emailUI(vetInputLabel),
    [veteranFields.verifyEmail]: confirmationEmailUI(
      vetInputLabel,
      veteranFields.email,
    ),
  },
  schema: {
    type: 'object',
    required: [veteranFields.address, veteranFields.primaryPhoneNumber],
    properties: {
      [veteranFields.address]: address,
      [veteranFields.primaryPhoneNumber]: phone,
      [veteranFields.alternativePhoneNumber]: phone,
      [veteranFields.email]: veteranProps.email,
      [veteranFields.verifyEmail]: veteranProps.email,
    },
  },
};

export default vetContactInfoPage;
