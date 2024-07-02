import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import {
  fullNameUI,
  ssnUI,
  vaFileNumberUI,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AltReviewRowView } from '../../../components/ReviewRowView';
import { generateHelpText, generateTitle } from '../../../utils/helpers';

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
    vaFileNumber: {
      ...vaFileNumberUI('Veteran’s VA file number'),
      'ui:description': generateHelpText(
        'Enter this number only if it’s different than their Social Security number',
      ),
      'ui:reviewField': AltReviewRowView,
    },
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
