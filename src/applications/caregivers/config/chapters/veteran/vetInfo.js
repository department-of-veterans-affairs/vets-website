import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { VetInfo } from 'applications/caregivers/components/AdditionalInfo';
import { veteranFields } from 'applications/caregivers/definitions/constants';

import { vetInputLabel } from 'applications/caregivers/definitions/UIDefinitions/veteranUI';
import {
  dateOfBirthUI,
  fullNameUI,
  genderUI,
  ssnUI,
} from 'applications/caregivers/definitions/UIDefinitions/sharedUI';

const { veteran } = fullSchema.properties;
const veteranProps = veteran.properties;

const vetInfoPage = {
  uiSchema: {
    'ui:description': VetInfo({ headerInfo: true }),
    [veteranFields.fullName]: fullNameUI(vetInputLabel),
    [veteranFields.ssn]: ssnUI(vetInputLabel),
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
