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
const inputLabel = content['secondary-two-input-label'];
const hintLabel = content['secondary-hint-label'];

const secondaryTwoPersonalInformation = {
  uiSchema: {
    ...titleUI(content['secondary-two-info-title--personal']),
    secondaryTwoFullName: fullNameUI({
      label: inputLabel,
      labelAlt: hintLabel,
    }),
    secondaryTwoDateOfBirth: dobUI(inputLabel),
    secondaryTwoGender: genderUI(inputLabel),
    secondaryTwoVetRelationship: vetRelationshipUI(inputLabel),
  },
  schema: {
    type: 'object',
    required: ['secondaryTwoDateOfBirth', 'secondaryTwoVetRelationship'],
    properties: {
      secondaryTwoFullName: fullNameSchema(fullName),
      secondaryTwoDateOfBirth: date,
      secondaryTwoGender: gender,
      secondaryTwoVetRelationship: vetRelationship,
    },
  },
};

export default secondaryTwoPersonalInformation;
