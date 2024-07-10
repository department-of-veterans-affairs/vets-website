import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { fullNameSchema } from '../../../definitions/sharedSchema';
import {
  dobUI,
  genderUI,
  fullNameUI,
  vetRelationshipUI,
} from '../../../definitions/sharedUI';
import content from '../../../locales/en/content.json';

const { fullName, date, gender, vetRelationship } = fullSchema.definitions;
const inputLabel = content['secondary-one-input-label'];
const hintLabel = content['secondary-hint-label'];

const secondaryOnePersonalInformation = {
  uiSchema: {
    ...titleUI(content['secondary-one-info-title--personal']),
    secondaryOneFullName: fullNameUI({
      label: inputLabel,
      labelAlt: hintLabel,
    }),
    secondaryOneDateOfBirth: dobUI(inputLabel),
    secondaryOneGender: genderUI(inputLabel),
    secondaryOneVetRelationship: vetRelationshipUI(inputLabel),
  },
  schema: {
    type: 'object',
    required: ['secondaryOneDateOfBirth', 'secondaryOneVetRelationship'],
    properties: {
      secondaryOneFullName: fullNameSchema(fullName),
      secondaryOneDateOfBirth: date,
      secondaryOneGender: gender,
      secondaryOneVetRelationship: vetRelationship,
    },
  },
};

export default secondaryOnePersonalInformation;
