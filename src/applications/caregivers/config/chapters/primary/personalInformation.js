import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { fullNameSchema } from '../../../definitions/sharedSchema';
import {
  dobUI,
  genderUI,
  fullNameUI,
  vetRelationshipUI,
} from '../../../definitions/sharedUI';
import { fullSchema } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { fullName, date, gender, vetRelationship } = fullSchema.definitions;
const inputLabel = content['primary-input-label'];
const hintLabel = content['primary-hint-label'];

const primaryPersonalInformation = {
  uiSchema: {
    ...titleUI(content['primary-info-title--personal']),
    primaryFullName: fullNameUI({ label: inputLabel, labelAlt: hintLabel }),
    primaryDateOfBirth: dobUI(inputLabel),
    primaryGender: genderUI(inputLabel),
    primaryVetRelationship: vetRelationshipUI(inputLabel),
  },
  schema: {
    type: 'object',
    required: ['primaryDateOfBirth', 'primaryVetRelationship'],
    properties: {
      primaryFullName: fullNameSchema(fullName),
      primaryDateOfBirth: date,
      primaryGender: gender,
      primaryVetRelationship: vetRelationship,
    },
  },
};

export default primaryPersonalInformation;
