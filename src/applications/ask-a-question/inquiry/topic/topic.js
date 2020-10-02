import _ from 'lodash/fp';
import { createSelector } from 'reselect';

import { vaMedicalFacilities } from 'vets-json-schema/dist/constants.json';

import fullSchema from '../../0873-schema.json';
import { topicTitle } from '../../content/labels';

const formFields = {
  levelOne: 'levelOne',
  levelTwo: 'levelTwo',
  levelThree: 'levelThree',
  vaMedicalCenter: 'vaMedicalCenter',
};

const getSchemaFromParentTopic = (topicSchema, value, isLevelThree = false) => {
  const parentLevel = isLevelThree ? 'subLevelTwo' : 'levelOne';
  const childLevel = isLevelThree ? 'levelThree' : 'levelTwo';
  const parentSchema = topicSchema.oneOf.filter(element => {
    return element.properties[parentLevel].enum.includes(value);
  });
  return parentSchema[0].properties[childLevel];
};

export const filterArrayByValue = (
  topicSchema,
  value,
  isLevelThree = false,
) => {
  const childSchema = getSchemaFromParentTopic(
    topicSchema,
    value,
    isLevelThree,
  );
  if (childSchema.type === 'string') {
    return childSchema.enum;
  }
  return _.flatten(
    childSchema.oneOf.map(subSchema => {
      return subSchema.properties.subLevelTwo.enum;
    }),
  );
};

const levelOneTopicLabels = [
  'Caregiver Support Program',
  'Health & Medical Issues & Services',
  'VA Ctr for Women Vets, Policies & Progs',
];

const levelTwoTopicLabels = [
  'Health/Medical Eligibility & Programs',
  'Prosthetics, Med Devices & Sensory Aids',
  'Women Veterans Health Care',
];

const valuesByLabelLookup = {};
levelOneTopicLabels.forEach(label => {
  valuesByLabelLookup[label] = filterArrayByValue(
    fullSchema.properties.topic,
    label,
  );
});
levelTwoTopicLabels.forEach(label => {
  const parentTopic = 'Health & Medical Issues & Services';
  valuesByLabelLookup[label] = filterArrayByValue(
    getSchemaFromParentTopic(fullSchema.properties.topic, parentTopic),
    label,
    true,
  );
});

function getAllMedicalCenters() {
  const medicalCenters = [];
  Object.values(vaMedicalFacilities).forEach(state =>
    state.map(facility => medicalCenters.push(facility)),
  );
  return _.sortBy(['label'], medicalCenters);
}

const vaMedicalCentersList = getAllMedicalCenters();

const vaMedicalCentersValues = vaMedicalCentersList.map(center => center.value);
const vaMedicalCentersLabels = vaMedicalCentersList.map(center => center.label);

export const levelThreeRequiredTopics = new Set([
  'Health/Medical Eligibility & Programs',
  'Prosthetics, Med Devices & Sensory Aids',
  'Women Veterans Health Care',
]);

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
