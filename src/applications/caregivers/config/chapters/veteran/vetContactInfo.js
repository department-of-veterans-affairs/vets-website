import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import confirmationEmailUI from 'platform/forms-system/src/js/definitions/confirmationEmail';
import {
  veteranFields,
  emptyObjectSchema,
} from 'applications/caregivers/definitions/constants';
import { vetInputLabel } from 'applications/caregivers/definitions/UIDefinitions/veteranUI';

import {
  emailUI,
  alternativePhoneNumberUI,
  primaryPhoneNumberUI,
  addressWithoutCountryUI,
  emailEncouragementUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';
import VeteranContactDescription from 'applications/caregivers/components/FormDescriptions/VeteranContactDescription';

const { veteran } = fullSchema.properties;
const veteranProps = veteran.properties;
const { address, phone } = fullSchema.definitions;

const vetContactInfoPage = {
  uiSchema: {
    'ui:description': VeteranContactDescription({
      pageTitle: 'Veteran contact information',
      showPageIntro: true,
    }),
    [veteranFields.address]: addressWithoutCountryUI(vetInputLabel),
    [veteranFields.primaryPhoneNumber]: primaryPhoneNumberUI(vetInputLabel),
    [veteranFields.alternativePhoneNumber]: alternativePhoneNumberUI(
      vetInputLabel,
    ),
    [veteranFields.emailEncouragementMessage]: emailEncouragementUI(),
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
      [veteranFields.emailEncouragementMessage]: emptyObjectSchema,
      [veteranFields.email]: veteranProps.email,
      [veteranFields.verifyEmail]: veteranProps.email,
    },
  },
};

export default vetContactInfoPage;
