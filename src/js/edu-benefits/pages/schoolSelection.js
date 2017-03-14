import _ from 'lodash/fp';

import * as educationProgram from '../definitions/educationProgram';
import { uiSchema as uiSchemaDate } from '../../common/schemaform/definitions/date';
import { states } from '../../common/utils/options-for-select';

const stateLabels = states.USA.reduce((current, { label, value }) => {
  return _.merge(current, { [value]: label });
}, {});

const defaults = {
  fields: [
    'educationProgram',
    'educationObjective',
    'nonVaAssistance'
  ],
  required: [
    // 'educationType',
    // 'name'
  ]
};

export default function createSchoolSelectionPage(schema, options) {
  const mergedOptions = _.merge(defaults, options);
  const { fields, required } = mergedOptions;

  const possibleUISchemaFields = {
    educationProgram: educationProgram.uiSchema,
    educationObjective: {
      'ui:title': 'Education or career goal (for example, “Get a bachelor’s degree in criminal justice” or “Get an HVAC technician certificate” or “Become a police officer.”)',
      'ui:widget': 'textarea'
    },
    nonVaAssistance: {
      'ui:title': 'Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?',
      'ui:widget': 'yesNo'
    },
    educationStartDate: uiSchemaDate('The date your training began or will begin'),
    restorativeTraining: {
      'ui:title': 'Are you seeking special restorative training?',
      'ui:widget': 'yesNo'
    },
    vocationalTraining: {
      'ui:title': 'Are you seeking special vocational training?',
      'ui:widget': 'yesNo'
    },
    trainingState: {
      'ui:title': 'In what state do you plan on living while participating in this training?',
      'ui:options': {
        labels: stateLabels
      }
    },
    educationalCounseling: {
      'ui:title': 'Would you like to receive vocational and educational counseling?',
      'ui:widget': 'yesNo'
    }
  };
  const pickFields = _.pick(fields);

  const schemaProperties = pickFields(schema.properties);
  if (schemaProperties.educationProgram) {
    schemaProperties.educationProgram =
      educationProgram.schema(
        schema,
        required
      );
  }

  const uiSchema = pickFields(possibleUISchemaFields);
  uiSchema['ui:order'] = fields;

  return {
    title: 'School selection',
    path: 'school-selection',
    uiSchema,
    schema: {
      definitions: {
        date: schema.definitions.date,
        educationType: schema.definitions.educationType
      },
      type: 'object',
      properties: schemaProperties
    }
  };
}
