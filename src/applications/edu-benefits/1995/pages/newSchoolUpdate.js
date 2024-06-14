import merge from 'lodash/merge';
import * as address from 'platform/forms/definitions/address';
import { validateWhiteSpace } from 'platform/forms/validations';
import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import { showSchoolAddress } from '../../utils/helpers';
import educationTypeUpdateUISchema from '../../definitions/educationTypeUpdate';

const { educationObjective } = fullSchema1995.properties;

const { educationTypeUpdate } = fullSchema1995.definitions;

export const uiSchema = {
  'ui:title': 'School or training facility you want to attend',
  // Broken up because we need to fit educationTypeUpdate between name and address
  // Put back together again in transform()
  newSchoolName: {
    'ui:title': 'Name of school or training facility',
    'ui:validations': [
      (errors, newSchoolName) => {
        validateWhiteSpace(errors, newSchoolName);
      },
    ],
  },
  educationTypeUpdate: educationTypeUpdateUISchema,
  newSchoolAddress: merge({}, address.uiSchema(), {
    'ui:options': {
      hideIf: formData => !showSchoolAddress(formData.educationTypeUpdate),
    },
  }),
  educationObjective: {
    'ui:title':
      'Education or career goal (For example, “I want to get a bachelor’s degree in criminal justice” or “I want to get an HVAC technician certificate” or “I want to become a police officer.”)',
    'ui:widget': 'textarea',
  },
};

export const schema = {
  type: 'object',
  properties: {
    newSchoolName: {
      type: 'string',
    },
    educationTypeUpdate,
    newSchoolAddress: address.schema(fullSchema1995),
    educationObjective,
  },
};
