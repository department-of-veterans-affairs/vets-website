import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { relationshipLabels } from '../../../utils/labels';

export const relationshipToVeteranUI = options => {
  const { personTitle } =
    typeof options === 'object' ? options : { personTitle: options };
  const person = personTitle ?? 'Veteran';

  return {
    relationshipToVeteran: {
      ...radioUI({
        title: `What’s your relationship to the ${person}?`,
        labels: relationshipLabels,
        errorMessages: {
          required: `Select your relationship to the ${person}`,
        },
        labelHeaderLevel: '',
        classNames: 'vads-u-margin-bottom--2',
      }),
    },
  };
};

const relationshipToVeteranSchema = {
  type: 'object',
  properties: {
    relationshipToVeteran: radioSchema([
      'spouse',
      'child',
      'parent',
      'executor',
      'funeralDirector',
      'otherFamily',
    ]),
  },
  required: ['relationshipToVeteran'],
};

export default {
  uiSchema: {
    ...titleUI('Relationship to Veteran'),
    ...relationshipToVeteranUI(),
  },
  schema: relationshipToVeteranSchema,
};
