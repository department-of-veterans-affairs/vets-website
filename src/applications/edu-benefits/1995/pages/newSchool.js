import educationTypeUISchema from '../../definitions/educationType';
import _ from 'lodash/fp';
import { showSchoolAddress } from '../../utils/helpers';
import * as address from 'platform/forms/definitions/address';
import { validateWhiteSpace } from 'platform/forms/validations';
import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

const {
  civilianBenefitsAssistance,
  educationObjective,
  nonVaAssistance,
} = fullSchema1995.properties;

const { educationType } = fullSchema1995.definitions;

export const uiSchema = {
  'ui:title':
    'School, university, program, or training facility you want to attend',
  // Broken up because we need to fit educationType between name and address
  // Put back together again in transform()
  newSchoolName: {
    'ui:title': 'Name of school, university, program, or training facility',
    'ui:validations': [
      (errors, newSchoolName) => {
        validateWhiteSpace(errors, newSchoolName);
      },
    ],
  },
  educationType: educationTypeUISchema,
  newSchoolAddress: _.merge(address.uiSchema(), {
    'ui:options': {
      hideIf: formData => !showSchoolAddress(formData.educationType),
    },
  }),
  educationObjective: {
    'ui:title':
      'Education or career goal (for example, “Get a bachelor’s degree in criminal justice” or “Get an HVAC technician certificate” or “Become a police officer.”)',
    'ui:widget': 'textarea',
  },
  nonVaAssistance: {
    'ui:title':
      'Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?',
    'ui:widget': 'yesNo',
  },
  civilianBenefitsAssistance: {
    'ui:title':
      'Are you getting benefits from the U.S. Government as a civilian employee during the same time as you’re seeking benefits from VA?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['educationType', 'newSchoolName'],
  properties: {
    newSchoolName: {
      type: 'string',
    },
    educationType,
    newSchoolAddress: address.schema(fullSchema1995),
    educationObjective,
    nonVaAssistance,
    civilianBenefitsAssistance,
  },
};
