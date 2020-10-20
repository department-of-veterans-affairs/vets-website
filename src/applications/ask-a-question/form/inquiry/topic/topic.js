import _ from 'lodash/fp';
import { createSelector } from 'reselect';

import fullSchema from '../../0873-schema.json';
import { topicTitle } from '../../../constants/labels';
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

// These are levelTwo topics that have level three subtopics and their respective levelOne parents
const levelTwoWithLevelThreeTopics = {
  'Burial & Memorial Benefits (NCA)': ['Burial Benefits'],
  'Health & Medical Issues & Services': [
    'Health/Medical Eligibility & Programs',
    'Prosthetics, Med Devices & Sensory Aids',
    'Women Veterans Health Care',
  ],
};

const valuesByLabelLookup = {};
levelOneTopicLabels.forEach(label => {
  valuesByLabelLookup[label] = filterTopicArrayByLabel(topicSchemaCopy, label);
});

const getLevelThreeTopics = () => {
  for (const [parentTopic, complexLevelTwo] of Object.entries(
    levelTwoWithLevelThreeTopics,
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
  _.flatten(Object.values(levelTwoWithLevelThreeTopics)),
);

export const medicalCenterRequiredTopics = new Set([
  'Medical Care Issues at Specific Facility',
  'Prosthetics, Med Devices & Sensory Aids',
]);

export function schema(currentSchema, topicProperty = 'topic') {
  const topicSchema = currentSchema.properties[topicProperty];
  return {
    type: 'object',
    required: ['levelOne', 'levelTwo'],
    properties: _.assign(topicSchema.properties, {
      levelOne: {
        type: 'string',
        enum: [
          'Burial & Memorial Benefits (NCA)',
          'Caregiver Support Program',
          'Health & Medical Issues & Services',
          'VA Ctr for Women Vets, Policies & Progs',
        ],
      },
      levelTwo: {
        title: topicTitle,
        type: 'string',
      },
      levelThree: {
        title: topicTitle,
        type: 'string',
      },
      vaMedicalCenter: {
        title: 'Medical Center List',
        type: 'string',
        enum: vaMedicalCentersValues,
        enumNames: vaMedicalCentersLabels,
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
    'ui:title': topicTitle,
    'ui:options': {
      updateSchema: (formData, topicSchema, index, path) => {
        return topicChangeSelector({
          formData,
          topicSchema,
          path,
        });
      },
    },
    'ui:order': ['levelOne', 'levelTwo', 'levelThree', 'vaMedicalCenter'],
    [formFields.levelOne]: {
      'ui:title': topicTitle,
    },
    [formFields.levelTwo]: {
      'ui:title': topicTitle,
    },
    [formFields.levelThree]: {
      'ui:title': topicTitle,
      'ui:required': formData => {
        return !!levelThreeRequiredTopics.has(formData.topic.levelTwo);
      },
      'ui:options': {
        expandUnder: 'levelTwo',
        expandUnderCondition: levelTwo => {
          return !!levelThreeRequiredTopics.has(levelTwo);
        },
      },
    },
    [formFields.vaMedicalCenter]: {
      'ui:title': 'Medical Center List',
      'ui:required': formData => {
        return !!medicalCenterRequiredTopics.has(formData.topic.levelTwo);
      },
      'ui:options': {
        expandUnder: 'levelTwo',
        expandUnderCondition: levelTwo => {
          return !!medicalCenterRequiredTopics.has(levelTwo);
        },
      },
    },
  };
}
