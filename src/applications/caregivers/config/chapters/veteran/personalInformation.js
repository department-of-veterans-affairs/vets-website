import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { fullNameSchema } from '../../../definitions/sharedSchema';
import { dobUI, genderUI, fullNameUI } from '../../../definitions/sharedUI';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { fullName, date, gender } = FULL_SCHEMA.definitions;
const inputLabel = content['vet-input-label'];

const veteranPersonalInformation = {
  uiSchema: {
    ...titleUI(content['vet-info-title--personal']),
    veteranFullName: fullNameUI({ label: inputLabel }),
    veteranDateOfBirth: dobUI(inputLabel),
    veteranGender: genderUI(inputLabel),
  },
  schema: {
    type: 'object',
    required: ['veteranDateOfBirth'],
    properties: {
      veteranFullName: fullNameSchema(fullName),
      veteranDateOfBirth: date,
      veteranGender: gender,
    },
  },
};

export default veteranPersonalInformation;
