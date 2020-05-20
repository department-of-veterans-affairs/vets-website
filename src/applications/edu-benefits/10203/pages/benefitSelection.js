import fullSchema from 'vets-json-schema/dist/22-1995-schema.json';

import { benefitsLabels } from '../../utils/labels';

const { benefit } = fullSchema.properties;

const displayBenefit = {
  ...benefit,
  enum: [...benefit.enum],
};

displayBenefit.enum.splice(1, 0, 'fryScholarship');

export const uiSchema = {
  benefit: {
    'ui:widget': 'radio',
    'ui:title':
      'Which benefit are you currently using or have you used most recently?',
    'ui:options': {
      labels: benefitsLabels,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    benefit: displayBenefit,
  },
};
