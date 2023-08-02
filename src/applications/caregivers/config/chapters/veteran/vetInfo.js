import merge from 'lodash/merge';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { veteranFields } from '../../../definitions/constants';
import {
  dateOfBirthUI,
  fullNameUI,
  genderUI,
  ssnUI,
} from '../../../definitions/UIDefinitions/sharedUI';
import { vetInputLabel } from '../../../definitions/UIDefinitions/veteranUI';
import { VeteranSSNDescription } from '../../../components/FormDescriptions';
import VeteranContactDescription from '../../../components/FormDescriptions/VeteranContactDescription';

const { veteran } = fullSchema.properties;
const veteranProps = veteran.properties;

const vetInfoPage = {
  uiSchema: {
    'ui:description': VeteranContactDescription({ showPageIntro: true }),
    [veteranFields.fullName]: fullNameUI(vetInputLabel),
    [veteranFields.ssn]: merge({}, ssnUI(vetInputLabel), {
      'ui:description': VeteranSSNDescription,
    }),
    [veteranFields.dateOfBirth]: dateOfBirthUI(vetInputLabel),
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
