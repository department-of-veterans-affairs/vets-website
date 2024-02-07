import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import {
  fullNameUI,
  ssnUI,
  vaFileNumberUI,
  dateOfBirthUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

const {
  veteranFullName,
  veteranSocialSecurityNumber,
  vaFileNumber,
  veteranDateOfBirth,
} = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Personal information'),
    veteranFullName: fullNameUI(title => `Veteran’s ${title}`),
    veteranSocialSecurityNumber: ssnUI('Veteran’s Social Security number'),
    vaFileNumber: vaFileNumberUI('Veteran’s VA file number'),
    veteranDateOfBirth: dateOfBirthUI('Veteran’s date of birth'),
  },
  schema: {
    type: 'object',
    required: [
      'veteranFullName',
      'veteranSocialSecurityNumber',
      'veteranDateOfBirth',
    ],
    properties: {
      veteranFullName,
      veteranSocialSecurityNumber,
      vaFileNumber,
      veteranDateOfBirth,
    },
  },
};
