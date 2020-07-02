import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { states } from 'vets-json-schema/dist/constants.json';

import { schoolStudentIdTitle } from '../content/programDetails';

const {
  degreeName,
  schoolName,
  schoolCity,
  schoolStudentId,
  schoolEmailAddress,
} = fullSchema10203.properties;

export const uiSchema = {
  'ui:title': 'STEM degree and school details',
  degreeName: {
    'ui:title': "What's the name of your STEM degree?",
  },
  schoolName: {
    'ui:title':
      'What’s the name of the school where you plan on using the Rogers STEM Scholarship?',
  },
  schoolCity: {
    'ui:title': 'City',
  },
  schoolState: {
    'ui:title': 'State',
  },
  schoolStudentId: {
    'ui:title': schoolStudentIdTitle,
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
  },
  schoolEmailAddress: {
    ...emailUI(),
    'ui:title':
      'Your school email address (This email address usually ends with .edu)',
  },
};

export const schema = {
  type: 'object',
  required: ['degreeName', 'schoolName', 'schoolCity', 'schoolState'],
  properties: {
    degreeName,
    schoolName,
    schoolCity,
    schoolState: {
      type: 'string',
      enum: states.USA.map(state => state.value),
      enumNames: states.USA.map(state => state.label),
    },
    schoolStudentId,
    schoolEmailAddress,
  },
};
