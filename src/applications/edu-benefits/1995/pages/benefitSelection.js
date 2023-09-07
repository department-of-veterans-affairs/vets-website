import fullSchema from 'vets-json-schema/dist/22-1995-schema.json';

import { benefitsLabels } from '../../utils/labels';

const { benefit } = fullSchema.properties;

const displayBenefit = {
  ...benefit,
  enum: [...benefit.enum],
};

/* 
  the schema has post9/11 listed as chapter33Post911
  and fry scholarship listed as chapter33FryScholarship
  In order to use the benefitsLabels import we rename
  the benefits from chapter33Post911 to chapter33
  and chapter33FryScholarship to fryScholarship

  Once the applicant submits the form, the function
  fryScholarshipTransform() located in the 
  submit-transform.js file runs.
  This changes back chapter33 to chapter33Post911
  and changes fryScholarship to chapter33FryScholarship
  to align with the values listed in the JSON Schema 
*/
displayBenefit.enum.splice(0, 1, 'chapter33');
displayBenefit.enum.splice(1, 1, 'fryScholarship');

export const uiSchema = {
  benefit: {
    'ui:widget': 'radio',
    'ui:title': 'Which benefit are you currently using?',
    'ui:options': {
      labels: benefitsLabels,
    },
  },
};

export const oldUiSchema = {
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
