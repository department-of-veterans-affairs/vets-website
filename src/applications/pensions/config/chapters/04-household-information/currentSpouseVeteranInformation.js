import get from 'platform/utilities/data/get';
import {
  yesNoUI,
  yesNoSchema,
  titleUI,
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateSpouseTitle, requiresSpouseInfo } from './helpers';
import { showMultiplePageResponse } from '../../../helpers';

const generateSpouseLabel = formData => {
  const spouseName = get('spouseFullName', formData);
  return {
    title: `Is ${spouseName.first} ${spouseName.last} also a Veteran?`,
  };
};

/** @type {PageSchema} */
export default {
  title: 'Spouse Veteran Information',
  path: 'household/current-marriage/spouse-veteran-information',
  depends: formData =>
    showMultiplePageResponse() && requiresSpouseInfo(formData),
  uiSchema: {
    ...titleUI(generateSpouseTitle('additional information')),
    spouseIsVeteran: yesNoUI({
      updateSchema: formData => generateSpouseLabel(formData),
    }),
    spouseVaFileNumber: {
      ...vaFileNumberUI(
        'Enter their VA file number if it does not match their SSN',
      ),
      'ui:options': {
        expandUnder: 'spouseIsVeteran',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['spouseIsVeteran'],
    properties: {
      spouseIsVeteran: yesNoSchema,
      spouseVaFileNumber: vaFileNumberSchema,
    },
  },
};
