import fullSchema from 'vets-json-schema/dist/22-1995-schema.json';
import environment from 'platform/utilities/environment';

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
    'ui:title': environment.isProduction()
      ? 'Which benefit are you currently using or have you used most recently?'
      : 'Which benefit are you currently using?',
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
