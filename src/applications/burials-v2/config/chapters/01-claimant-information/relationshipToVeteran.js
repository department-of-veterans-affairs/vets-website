// import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import {
  radioUI,
  radioSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { relationshipLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

export const relationshipToVeteranUI = options => {
  const { personTitle } =
    typeof options === 'object' ? options : { personTitle: options };
  const person = personTitle ?? 'Veteran';

  return {
    relationshipToVeteran: {
      ...radioUI({
        title: `Whats your relationship to the ${person}?`,
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
