import _ from 'lodash/fp';
import { createSelector } from 'reselect';
import { states } from 'vets-json-schema/dist/constants.json';

import fullSchema from '../../0873-schema.json';
import {
  topicLevelOneTitle,
  topicLevelTwoTitle,
  topicLevelThreeTitle,
  vaMedicalCenterTitle,
  routeToStateTitle,
} from '../../../constants/labels';
import {
  vaMedicalCentersLabels,
  vaMedicalCentersValues,
} from './medicalCenters';

const topicSchemaCopy = _.clone(fullSchema.properties.topic);
topicSchemaCopy.anyOf.pop();

const formFields = {
  levelOne: 'levelOne',
  levelTwo: 'levelTwo',
  levelThree: 'levelThree',
  vaMedicalCenter: 'vaMedicalCenter',
  routeToState: 'routeToState',
};

const getChildSchemaFromParentTopic = (
  topicSchema,
  value,
  isLevelThree = false,
) => {
  const parentLevel = isLevelThree ? 'subLevelTwo' : 'levelOne';
  const childLevel = isLevelThree ? 'levelThree' : 'levelTwo';
  const parentSchema = topicSchema.anyOf.filter(element => {
    return element.properties[parentLevel].enum.includes(value);
  });
  return parentSchema[0].properties[childLevel];
};

export const filterTopicArrayByLabel = (
  topicSchema,
  value,
  isLevelThree = false,
) => {
  const childSchema = getChildSchemaFromParentTopic(
    topicSchema,
    value,
    isLevelThree,
  );
  let labelList;
  if (childSchema.type === 'string') {
    labelList = childSchema.enum;
  } else {
    labelList = _.flatten(
      childSchema.anyOf.map(subSchema => {
        return subSchema.properties.subLevelTwo.enum;
      }),
    );
  }
  return isLevelThree ? labelList : _.orderBy([], 'asc', labelList);
};

const levelOneTopicLabels = topicSchemaCopy.anyOf.map(topicSchema => {
  return topicSchema.properties.levelOne.enum[0];
});

// Maps levelOne categories to list of levelTwo topics that have levelThree subtopics
export const getTopicsWithSubtopicsByCategory = topicSchema => {
  const topicsWithSubtopicsByCategory = {};
  topicSchema.anyOf.forEach(categorySchema => {
    if (categorySchema.properties.levelTwo.type === 'object') {
      const topicsWithSubtopics = categorySchema.properties.levelTwo.anyOf
        .filter(levelTwoSchema => levelTwoSchema.properties.levelThree)
        .map(levelTwoSchema => levelTwoSchema.properties.subLevelTwo.enum[0]);
      topicsWithSubtopicsByCategory[
        categorySchema.properties.levelOne.enum[0]
      ] = topicsWithSubtopics;
    }
  });
  return topicsWithSubtopicsByCategory;
};

const valuesByLabelLookup = {};
levelOneTopicLabels.forEach(label => {
  valuesByLabelLookup[label] = filterTopicArrayByLabel(topicSchemaCopy, label);
});

const getLevelThreeTopics = () => {
  for (const [parentTopic, complexLevelTwo] of Object.entries(
    getTopicsWithSubtopicsByCategory(topicSchemaCopy),
  )) {
    complexLevelTwo.forEach(label => {
      valuesByLabelLookup[label] = filterTopicArrayByLabel(
        getChildSchemaFromParentTopic(topicSchemaCopy, parentTopic),
        label,
        true,
      );
    });
  }
};

getLevelThreeTopics();

export const updateFormData = (oldData, newData) => {
  if (oldData.topic.levelOne !== newData.topic.levelOne) {
    Object.assign(newData.topic, { levelTwo: undefined });
  }
  return newData;
};

export const levelThreeRequiredTopics = new Set(
  _.flatten(Object.values(getTopicsWithSubtopicsByCategory(topicSchemaCopy))),
);

export const medicalCenterRequiredTopics = new Set([
  'Medical Care Issues at Specific Facility',
  'Prosthetics, Med Devices & Sensory Aids',
]);

export const routeToStateRequiredTopics = new Set([
  'Home Loan/Mortgage Guaranty Issues',
]);

export function schema(currentSchema, topicProperty = 'topic') {
  const topicSchema = currentSchema.properties[topicProperty];
  return {
    type: 'object',
    required: ['levelOne', 'levelTwo'],
    properties: _.assign(topicSchema.properties, {
      levelOne: {
        type: 'string',
        enum: _.orderBy([], 'asc', levelOneTopicLabels),
      },
      levelTwo: {
        type: 'string',
      },
      levelThree: {
        type: 'string',
      },
      vaMedicalCenter: {
        type: 'string',
        enum: vaMedicalCentersValues,
        enumNames: vaMedicalCentersLabels,
      },
      routeToState: {
        type: 'string',
        enum: states.USA.map(state => state.value),
        enumNames: states.USA.map(state => state.label),
      },
    }),
  };
}

export function uiSchema() {
  const topicChangeSelector = createSelector(
    ({ formData }) => _.get(['topic'].concat('levelOne'), formData),
    ({ formData }) => _.get(['topic'].concat('levelTwo'), formData),
    _.get('topicSchema'),
    (levelOne, levelTwo, topicSchema) => {
      const schemaUpdate = {
        properties: topicSchema.properties,
      };
      const levelTwoLabelList = valuesByLabelLookup[levelOne];
      if (
        levelTwoLabelList &&
        topicSchema.properties.levelTwo.enum !== levelTwoLabelList
      ) {
        // We have a list and it’s different, so we need to make schema updates
        const withEnum = _.set(
          'levelTwo.enum',
          levelTwoLabelList,
          schemaUpdate.properties,
        );
        schemaUpdate.properties = _.set(
          'levelTwo.enumNames',
          levelTwoLabelList,
          withEnum,
        );
      } else if (levelTwoLabelList === undefined) {
        const withEnum = _.set('levelTwo.enum', [], schemaUpdate.properties);
        schemaUpdate.properties = _.set('levelTwo.enumNames', [], withEnum);
      }

      if (levelTwo) {
        const levelThreeLabelList = valuesByLabelLookup[levelTwo];

        if (
          levelThreeLabelList &&
          topicSchema.properties.levelThree.enum !== levelThreeLabelList
        ) {
          // We have a list and it’s different, so we need to make schema updates
          const withEnum = _.set(
            'levelThree.enum',
            levelThreeLabelList,
            schemaUpdate.properties,
          );
          schemaUpdate.properties = _.set(
            'levelThree.enumNames',
            levelThreeLabelList,
            withEnum,
          );
        } else if (levelThreeLabelList === undefined) {
          const withEnum = _.set(
            'levelThree.enum',
            [],
            schemaUpdate.properties,
          );
          schemaUpdate.properties = _.set('levelThree.enumNames', [], withEnum);
        }
      }

      return schemaUpdate;
    },
  );

  return {
    'ui:options': {
      updateSchema: (formData, topicSchema, index, path) => {
        return topicChangeSelector({
          formData,
          topicSchema,
          path,
        });
      },
    },
    'ui:order': [
      'levelOne',
      'levelTwo',
      'levelThree',
      'vaMedicalCenter',
      'routeToState',
    ],
    [formFields.levelOne]: {
      'ui:title': topicLevelOneTitle,
      'ui:errorMessages': {
        required: 'Please enter your category',
      },
    },
    [formFields.levelTwo]: {
      'ui:title': topicLevelTwoTitle,
      'ui:errorMessages': {
        required: 'Please enter your topic',
      },
    },
    [formFields.levelThree]: {
      'ui:title': topicLevelThreeTitle,
      'ui:required': formData => {
        return !!levelThreeRequiredTopics.has(formData.topic.levelTwo);
      },
      'ui:options': {
        expandUnder: 'levelTwo',
        expandUnderCondition: levelTwo => {
          return !!levelThreeRequiredTopics.has(levelTwo);
        },
      },
      'ui:errorMessages': {
        required: 'Please enter your subtopic',
      },
    },
    [formFields.vaMedicalCenter]: {
      'ui:title': vaMedicalCenterTitle,
      'ui:required': formData => {
        return !!medicalCenterRequiredTopics.has(formData.topic.levelTwo);
      },
      'ui:options': {
        expandUnder: 'levelTwo',
        expandUnderCondition: levelTwo => {
          return !!medicalCenterRequiredTopics.has(levelTwo);
        },
      },
      'ui:errorMessages': {
        required: 'Please enter your medical center',
      },
    },
    [formFields.routeToState]: {
      'ui:title': routeToStateTitle,
      'ui:required': formData => {
        return !!routeToStateRequiredTopics.has(formData.topic.levelTwo);
      },
      'ui:options': {
        expandUnder: 'levelTwo',
        expandUnderCondition: levelTwo => {
          return !!routeToStateRequiredTopics.has(levelTwo);
        },
      },
      'ui:errorMessages': {
        required: 'Please enter your state',
      },
    },
  };
}
