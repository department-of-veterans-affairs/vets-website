import { flatten, orderBy } from 'lodash';
import clone from 'platform/utilities/data/clone';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { createSelector } from 'reselect';
import constants from 'vets-json-schema/dist/constants.json';

import fullSchema from '../../0873-schema.json';
import {
  medicalCenterError,
  routeToStateError,
  routeToStateTitle,
  facilityCodeError,
  facilityCodeTitle,
  stateOfResidence,
  stateOfResidenceError,
  stateOfSchool,
  stateOfSchoolError,
  topicLevelOneError,
  topicLevelOneTitle,
  topicLevelThreeError,
  topicLevelThreeTitle,
  topicLevelTwoError,
  topicLevelTwoTitle,
  vaMedicalCenterTitle,
} from '../../../constants/labels';
import {
  vaMedicalCentersLabels,
  vaMedicalCentersValues,
} from './medicalCenters';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';

const topicSchemaCopy = clone(fullSchema.properties.topic);
topicSchemaCopy.anyOf.pop();

const formFields = {
  levelOne: 'levelOne',
  levelTwo: 'levelTwo',
  levelThree: 'levelThree',
  vaMedicalCenter: 'vaMedicalCenter',
  routeToState: 'routeToState',
  facilityCode: 'facilityCode',
  stateOfResidence: 'stateOfResidence',
  stateOfSchool: 'stateOfSchool',
  socialSecurityNumber: 'socialSecurityNumber',
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
    labelList = flatten(
      childSchema.anyOf.map(subSchema => {
        return subSchema.properties.subLevelTwo.enum;
      }),
    );
  }
  return isLevelThree ? labelList : orderBy(labelList, [], 'asc');
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
  if (
    oldData.topic.socialSecurityNumber !== newData.topic.socialSecurityNumber
  ) {
    Object.assign(newData.veteranServiceInformation, {
      socialSecurityNumber: newData.topic.socialSecurityNumber,
    });
  }
  return newData;
};

export const levelThreeRequiredTopics = new Set(
  flatten(Object.values(getTopicsWithSubtopicsByCategory(topicSchemaCopy))),
);

export const medicalCenterRequiredTopics = new Set([
  'Medical Care Issues at Specific Facility',
  'Prosthetics, Med Devices & Sensory Aids',
]);

export const routeToStateRequiredTopics = new Set([
  'Home Loan/Mortgage Guaranty Issues',
]);

export const showFacilityCodeField = new Set(['School Officials Only']);

export const showAdditionalGIBillFields = new Set([
  'Work Study',
  'Post-9/11 GI Bill',
  'On-the-Job Training (OJT)/Apprenticeship',
  'Survivors & Dependents',
  'MGIB - Active Duty (Ch 30)',
  'MGIB - Selected Reserve (Ch 1606)',
  'School Certifying Official File Transfer',
  'Licensing and Certification Tests',
  'VR&E Counselors',
  'Transfer of Benefits to Dependents (TEB)',
  'Tuition Assistance Top-Up',
  'WAVE',
  'Counseling',
  'VEAP (Ch 32)',
  'Reserve Ed Asst Prog (Ch 1607) (REAP)',
  'National Testing Programs',
  'Colmery Section 110',
]);

export function isValidFacilityCode(value) {
  return /^[a-zA-Z0-9]{8}$/.test(value);
}

export function validateFacilityCode(errors, facilityCode) {
  if (facilityCode && !isValidFacilityCode(facilityCode)) {
    errors.addError(facilityCodeError);
  }
}

export function schema(currentSchema, topicProperty = 'topic') {
  const topicSchema = currentSchema.properties[topicProperty];
  return {
    type: 'object',
    required: ['levelOne', 'levelTwo'],
    properties: {
      ...topicSchema.properties,
      levelOne: {
        type: 'string',
        enum: orderBy(levelOneTopicLabels, [], 'asc'),
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
        enum: constants.states.USA.map(state => state.value),
        enumNames: constants.states.USA.map(state => state.label),
      },
      stateOfResidence: {
        type: 'string',
        enum: constants.states.USA.map(state => state.value),
        enumNames: constants.states.USA.map(state => state.label),
      },
      stateOfSchool: {
        type: 'string',
        enum: constants.states.USA.map(state => state.value),
        enumNames: constants.states.USA.map(state => state.label),
      },
    },
  };
}

export function uiSchema() {
  const topicChangeSelector = createSelector(
    ({ formData }) => get(['topic'].concat('levelOne'), formData),
    ({ formData }) => get(['topic'].concat('levelTwo'), formData),
    ({ topicSchema }) => topicSchema,
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
        const withEnum = set(
          'levelTwo.enum',
          levelTwoLabelList,
          schemaUpdate.properties,
        );
        schemaUpdate.properties = set(
          'levelTwo.enumNames',
          levelTwoLabelList,
          withEnum,
        );
      } else if (levelTwoLabelList === undefined) {
        const withEnum = set('levelTwo.enum', [], schemaUpdate.properties);
        schemaUpdate.properties = set('levelTwo.enumNames', [], withEnum);
      }

      if (levelTwo) {
        const levelThreeLabelList = valuesByLabelLookup[levelTwo];

        if (
          levelThreeLabelList &&
          topicSchema.properties.levelThree.enum !== levelThreeLabelList
        ) {
          // We have a list and it’s different, so we need to make schema updates
          const withEnum = set(
            'levelThree.enum',
            levelThreeLabelList,
            schemaUpdate.properties,
          );
          schemaUpdate.properties = set(
            'levelThree.enumNames',
            levelThreeLabelList,
            withEnum,
          );
        } else if (levelThreeLabelList === undefined) {
          const withEnum = set('levelThree.enum', [], schemaUpdate.properties);
          schemaUpdate.properties = set('levelThree.enumNames', [], withEnum);
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
      'facilityCode',
      'stateOfResidence',
      'stateOfSchool',
      'socialSecurityNumber',
    ],
    [formFields.levelOne]: {
      'ui:title': topicLevelOneTitle,
      'ui:errorMessages': {
        required: topicLevelOneError,
      },
    },
    [formFields.levelTwo]: {
      'ui:title': topicLevelTwoTitle,
      'ui:errorMessages': {
        required: topicLevelTwoError,
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
        required: topicLevelThreeError,
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
        required: medicalCenterError,
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
        required: routeToStateError,
      },
    },
    [formFields.facilityCode]: {
      'ui:title': facilityCodeTitle,
      'ui:options': {
        expandUnder: 'levelTwo',
        expandUnderCondition: levelTwo => {
          return !!showFacilityCodeField.has(levelTwo);
        },
      },
      'ui:validations': [validateFacilityCode],
    },
    [formFields.stateOfResidence]: {
      'ui:title': stateOfResidence,
      'ui:required': formData => {
        return !!showAdditionalGIBillFields.has(formData.topic.levelTwo);
      },
      'ui:options': {
        expandUnder: 'levelTwo',
        expandUnderCondition: levelTwo => {
          return !!showAdditionalGIBillFields.has(levelTwo);
        },
      },
      'ui:errorMessages': {
        required: stateOfResidenceError,
      },
    },
    [formFields.stateOfSchool]: {
      'ui:title': stateOfSchool,
      'ui:required': formData => {
        return !!showAdditionalGIBillFields.has(formData.topic.levelTwo);
      },
      'ui:options': {
        expandUnder: 'levelTwo',
        expandUnderCondition: levelTwo => {
          return !!showAdditionalGIBillFields.has(levelTwo);
        },
      },
      'ui:errorMessages': {
        required: stateOfSchoolError,
      },
    },
    [formFields.socialSecurityNumber]: {
      ...ssnUI,
      'ui:required': formData => {
        return !!showAdditionalGIBillFields.has(formData.topic.levelTwo);
      },
      'ui:options': {
        expandUnder: 'levelTwo',
        expandUnderCondition: levelTwo => {
          return !!showAdditionalGIBillFields.has(levelTwo);
        },
        widgetClassNames: 'usa-input-medium',
      },
    },
  };
}
