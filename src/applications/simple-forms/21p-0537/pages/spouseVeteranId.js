import {
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateSpouseSsnNotMatchVeteranSsn } from '../utils/validations';

const spouseVeteranIdUI = ssnOrVaFileNumberUI();
spouseVeteranIdUI.ssn['ui:title'] = "Spouse's Social Security number";
spouseVeteranIdUI.ssn['ui:validations'] = [
  ...(spouseVeteranIdUI.ssn['ui:validations'] || []),
  validateSpouseSsnNotMatchVeteranSsn,
];
spouseVeteranIdUI.ssn['ui:options'] = {
  ...(spouseVeteranIdUI.ssn['ui:options'] || {}),
  useAllFormData: true,
};
spouseVeteranIdUI.vaFileNumber['ui:title'] = "Spouse's VA file number";

export default {
  uiSchema: {
    ...titleUI("Spouse's identification information"),
    'ui:description':
      "We need your spouse's Social Security number or VA file number. We'll use this information to locate their records in our system. You can find them on your original DIC award letter or previous VA communications.",
    remarriage: {
      spouseVeteranId: spouseVeteranIdUI,
    },
  },
  schema: {
    type: 'object',
    properties: {
      remarriage: {
        type: 'object',
        required: ['spouseVeteranId'],
        properties: {
          spouseVeteranId: ssnOrVaFileNumberSchema,
        },
      },
    },
  },
};
