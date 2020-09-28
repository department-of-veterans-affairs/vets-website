import { topicTitle } from '../../content/labels';
import { createSelector } from 'reselect';
import _ from 'lodash/fp';

const formFields = {
  levelOne: 'levelOne',
  levelTwo: 'levelTwo',
  levelThree: 'levelThree',
};

const caregiverValues = [
  'General Caregiver Support/Education',
  'Comprehensive Family Caregiver Program',
  'VA Supportive Services',
];

const valuesByLabelLookup = {
  'Caregiver Support Program': caregiverValues,
};

const topicUI = {
  [formFields.levelOne]: {
    'ui:title': topicTitle,
  },
};
export function schema(currentSchema, topicProperty = 'topic') {
  const topicSchema = currentSchema.definitions[topicProperty];
  return {
    type: 'object',
    properties: _.assign(topicSchema.properties, {
      levelOne: {
        type: 'string',
        enum: ['Caregiver Support Program'],
      },
      levelTwo: {
        title: topicTitle,
        type: 'string',
      },
    }),
  };
}

export function uiSchema() {
  const addressChangeSelector = createSelector(
    ({ formData }) => _.get(['topic'].concat('levelOne'), formData),
    ({ formData }) => _.get(['topic'].concat('levelTwo'), formData),
    _.get('topicSchema'),
    (levelOne, levelTwo, topicSchema) => {
      const schemaUpdate = {
        properties: topicSchema.properties,
      };

      const labelList = valuesByLabelLookup[levelOne];

      if (labelList && topicSchema.properties.levelTwo.enum !== labelList) {
        // We have a list and it’s different, so we need to make schema updates
        const withEnum = _.set(
          'levelTwo.enum',
          labelList,
          schemaUpdate.properties,
        );
        schemaUpdate.properties = _.set(
          'levelTwo.enumNames',
          labelList,
          withEnum,
        );
      }

      return schemaUpdate;
    },
  );

  return {
    'ui:title': topicTitle,
    'ui:options': {
      updateSchema: (formData, topicSchema, index, path) => {
        return addressChangeSelector({
          formData,
          topicSchema,
          path,
        });
      },
    },
    [formFields.levelOne]: {
      'ui:title': topicTitle,
    },
    [formFields.levelTwo]: {
      'ui:title': topicTitle,
    },
  };
}

export default topicUI;
