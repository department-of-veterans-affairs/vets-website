import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { fullNameSchema } from '../../../definitions/sharedSchema';
import {
  dobUI,
  genderUI,
  fullNameUI,
  vetRelationshipUI,
} from '../../../definitions/sharedUI';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { fullName, date, gender, vetRelationship } = FULL_SCHEMA.definitions;
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
