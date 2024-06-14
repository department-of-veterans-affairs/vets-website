import merge from 'lodash/merge';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { veteranFields } from '../../../definitions/constants';
import {
  dobUI,
  fullNameUI,
  customFieldSchemaUI,
  genderUI,
  ssnUI,
} from '../../../definitions/UIDefinitions/sharedUI';
import { vetInputLabel } from '../../../definitions/UIDefinitions/veteranUI';
import {
  VeteranSSNDescription,
  VeteranFullNameDescription,
} from '../../../components/FormDescriptions';
import VeteranContactDescription from '../../../components/FormDescriptions/VeteranContactDescription';

const { veteran } = fullSchema.properties;
const veteranProps = veteran.properties;
// Initialize fullNameUI with originalUI object
let extendedNameUI = fullNameUI(vetInputLabel);
// Add/replace whatever key/values needed
extendedNameUI = customFieldSchemaUI(
  extendedNameUI,
  'first',
  'ui:description',
  VeteranFullNameDescription,
);

const vetInfoPage = {
  uiSchema: {
    'ui:description': VeteranContactDescription({ showPageIntro: true }),
    [veteranFields.fullName]: extendedNameUI,
    [veteranFields.ssn]: merge({}, ssnUI(vetInputLabel), {
      'ui:description': VeteranSSNDescription,
    }),
    [veteranFields.dateOfBirth]: dobUI(vetInputLabel),
    [veteranFields.gender]: genderUI(vetInputLabel),
  },
  schema: {
    type: 'object',
    required: [
      veteranFields.dateOfBirth,
      veteranFields.fullName,
      veteranFields.ssn,
    ],
    properties: {
      [veteranFields.fullName]: veteranProps.fullName,
      [veteranFields.ssn]: veteranProps.ssnOrTin,
      [veteranFields.dateOfBirth]: veteranProps.dateOfBirth,
      [veteranFields.gender]: veteranProps.gender,
    },
  },
};

export default vetInfoPage;
