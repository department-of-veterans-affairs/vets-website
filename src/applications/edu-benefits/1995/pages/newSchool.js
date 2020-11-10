import educationTypeUISchema from '../../definitions/educationType';
import _ from 'lodash/fp';
import { showSchoolAddress } from '../../utils/helpers';
import * as address from 'platform/forms/definitions/address';
import { validateWhiteSpace } from 'platform/forms/validations';
import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import environment from 'platform/utilities/environment';

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
    // Prod flag for #15720
    'ui:title': environment.isProduction()
      ? 'Education or career goal (for example, “Get a bachelor’s degree in criminal justice” or “Get an HVAC technician certificate” or “Become a police officer.”)'
      : 'Education or career goal (For example, “I want to get a bachelor’s degree in criminal justice” or “I want to get an HVAC technician certificate” or “I want to become a police officer.”)',
    'ui:widget': 'textarea',
  },
  nonVaAssistance: {
    'ui:title':
      'Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?',
    'ui:widget': 'yesNo',
  },
  civilianBenefitsAssistance: {
    // Prod flag for #15720
    'ui:title': environment.isProduction()
      ? 'Are you getting benefits from the U.S. Government as a civilian employee during the same time as you’re seeking benefits from VA?'
      : 'Are you getting benefits from the U.S. government as a civilian employee during the same time as you’re requesting benefits from VA?',
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
