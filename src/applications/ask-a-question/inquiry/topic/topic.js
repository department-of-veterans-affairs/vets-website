import { topicTitle } from '../../content/labels';
import { createSelector } from 'reselect';
import _ from 'lodash/fp';
import { vaMedicalFacilities } from 'vets-json-schema/dist/constants.json';

const formFields = {
  levelOne: 'levelOne',
  levelTwo: 'levelTwo',
  levelThree: 'levelThree',
  vaMedicalFacility: 'vaMedicalFacility',
};

const caregiverValues = [
  'General Caregiver Support/Education',
  'Comprehensive Family Caregiver Program',
  'VA Supportive Services',
];

const healthAndIssuesValues = [
  'Medical Care Issues at Specific Facility',
  'Health/Medical Eligibility & Programs',
  'My HealtheVet',
  'Prosthetics, Med Devices & Sensory Aids',
  'Vet Center / Readjustment Counseling Service (RCS)',
  'Women Veterans Health Care',
];

const womenVetsValues = [
  'Policy Questions',
  'Question about Women Veterans Programs',
];

const medicalEligibilityValues = [
  'Apply for Health Benefits (Veterans)',
  'Medical Care for Veterans within USA',
  'Medical Care-Overseas Vets (Foreign Med)',
  'Children of Women Vietnam Vets Healthcare',
  'Apply for Health Benefits (Dependents)',
  'CHAMPVA-Civilian Health & Medical Prog',
  'CHAMPVA Password/Access Problems',
  'CHAMPVA CITI (In house Treatment Initiated)',
  'Spina Bifida Program for Children of Vet',
  'Licensed Health Professional Employment]',
];

const medDevicesValues = [
  'Artificial Limbs/Orthotics',
  'Automobile Adaptive Equipment',
  'Clothing Allowance',
  'Durable Medical Equipment',
  'Eyeglasses',
  'Hearing Aids',
  'Home Improvements & Structural Alteratio',
  'Home Oxygen',
  'Wheelchairs',
  'Prosthetics Web Site',
  'Technical Problems',
  'Other Prosthetics Issues',
];

const womensHealthValues = ['General Concern'];

const valuesByLabelLookup = {
  'Caregiver Support Program': caregiverValues,
  'Health & Medical Issues & Services': healthAndIssuesValues,
  'VA Ctr for Women Vets, Policies & Progs': womenVetsValues,
  'Health/Medical Eligibility & Programs': medicalEligibilityValues,
  'Prosthetics, Med Devices & Sensory Aids': medDevicesValues,
  'Women Veterans Health Care': womensHealthValues,
};

function flattenMedicalFacilityList() {
  const array = [];
  Object.values(vaMedicalFacilities).forEach(state =>
    state.map(facility => array.push(facility)),
  );
  return array;
}

const vaMedicalList = flattenMedicalFacilityList();

const vaMedicalFacilityValues = vaMedicalList.map(facility => facility.value);
const vaMedicalFacilityLabels = vaMedicalList.map(facility => facility.label);

export const levelThreeRequiredTopics = new Set([
  'Health/Medical Eligibility & Programs',
  'Prosthetics, Med Devices & Sensory Aids',
  'Women Veterans Health Care',
]);

export function schema(currentSchema, topicProperty = 'topic') {
  const topicSchema = currentSchema.definitions[topicProperty];
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
      vaMedicalFacility: {
        title: 'Medical Center List',
        type: 'string',
        enum: vaMedicalFacilityValues,
        enumNames: vaMedicalFacilityLabels,
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
    'ui:order': ['levelOne', 'levelTwo', 'levelThree', 'vaMedicalFacility'],
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
    [formFields.vaMedicalFacility]: {
      'ui:title': 'Medical Center List',
      'ui:options': {
        expandUnder: 'levelTwo',
        expandUnderCondition: levelTwo => {
          return (
            levelTwo === 'Medical Care Issues at Specific Facility' ||
            levelTwo === 'Prosthetics, Med Devices & Sensory Aids'
          );
        },
      },
    },
  };
}
