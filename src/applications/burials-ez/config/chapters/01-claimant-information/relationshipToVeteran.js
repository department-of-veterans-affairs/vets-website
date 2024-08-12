import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { relationshipLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

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
    ...relationshipToVeteranUI(),
    'ui:title': generateTitle('Relationship to Veteran'),
  },
  schema: relationshipToVeteranSchema,
};
