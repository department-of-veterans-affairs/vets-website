import _ from 'platform/utilities/data';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import merge from 'lodash/merge';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

const {
  homelessOrAtRisk,
  homelessHousingSituation,
  otherHomelessHousing,
  needToLeaveHousing,
  atRiskHousingSituation,
  otherAtRiskHousing,
  homelessnessContact,
} = fullSchema.properties;

import { homelessLabel, atRiskLabel } from '../content/homelessOrAtRisk';

import {
  HOMELESSNESS_TYPES,
  AT_RISK_HOUSING_TYPES,
  HOMELESS_HOUSING_TYPES,
} from '../constants';

import { getHomelessOrAtRisk } from '../utils';

export const uiSchema = {
  homelessOrAtRisk: {
    'ui:title': 'Are you homeless or at risk of becoming homeless?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        no: 'No',
        homeless: homelessLabel,
        atRisk: atRiskLabel,
      },
    },
  },
  'view:isHomeless': {
    'ui:options': {
      expandUnder: 'homelessOrAtRisk',
      expandUnderCondition: HOMELESSNESS_TYPES.homeless,
    },
    homelessHousingSituation: {
      'ui:title': 'Please describe your current living situation.',
      'ui:required': formData =>
        _.get('homelessOrAtRisk', formData, '') === HOMELESSNESS_TYPES.homeless,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          shelter: 'I’m living in a homeless shelter.',
          notShelter:
            'I’m living somewhere other than a shelter. (For example, I’m living in a car or a tent.)',
          anotherPerson: 'I’m living with another person.',
          other: 'Other',
        },
      },
    },
    otherHomelessHousing: {
      'ui:title': 'Please describe',
      'ui:required': formData =>
        _.get('view:isHomeless.homelessHousingSituation', formData, '') ===
        HOMELESS_HOUSING_TYPES.other,
      'ui:options': {
        hideIf: formData =>
          _.get('view:isHomeless.homelessHousingSituation', formData, '') !==
          HOMELESS_HOUSING_TYPES.other,
      },
    },
    needToLeaveHousing: {
      'ui:title': 'Do you need to quickly leave your current living situation?',
      'ui:required': formData =>
        _.get('homelessOrAtRisk', formData, '') === HOMELESSNESS_TYPES.homeless,
      'ui:widget': 'yesNo',
    },
  },
  'view:isAtRisk': {
    'ui:options': {
      expandUnder: 'homelessOrAtRisk',
      expandUnderCondition: HOMELESSNESS_TYPES.atRisk,
    },
    atRiskHousingSituation: {
      'ui:title': 'Please describe your housing situation',
      'ui:required': formData =>
        _.get('homelessOrAtRisk', formData, '') === HOMELESSNESS_TYPES.atRisk,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          losingHousing: 'I’m losing my housing in 30 days.',
          leavingShelter:
            'I’m leaving a publicly funded homeless shelter soon.',
          other: 'Other',
        },
      },
    },
    otherAtRiskHousing: {
      'ui:title': 'Please describe',
      'ui:required': formData =>
        _.get('view:isAtRisk.atRiskHousingSituation', formData, '') ===
        AT_RISK_HOUSING_TYPES.other,
      'ui:options': {
        hideIf: formData =>
          _.get('view:isAtRisk.atRiskHousingSituation', formData, '') !==
          AT_RISK_HOUSING_TYPES.other,
      },
    },
  },
  homelessnessContact: {
    'ui:title': ' ',
    'ui:description':
      'Please provide the name of a person or place we can call if we need to get in touch with you.',
    'ui:options': {
      expandUnder: 'homelessOrAtRisk',
      expandUnderCondition: housing =>
        housing === HOMELESSNESS_TYPES.homeless ||
        housing === HOMELESSNESS_TYPES.atRisk,
    },
    name: {
      'ui:title': 'Name',
      'ui:required': getHomelessOrAtRisk,
    },
    phoneNumber: merge({}, phoneUI('Phone number'), {
      'ui:required': getHomelessOrAtRisk,
    }),
  },
};

export const schema = {
  type: 'object',
  required: ['homelessOrAtRisk'],
  properties: {
    homelessOrAtRisk,
    'view:isHomeless': {
      type: 'object',
      properties: {
        homelessHousingSituation,
        otherHomelessHousing,
        needToLeaveHousing,
      },
    },
    'view:isAtRisk': {
      type: 'object',
      properties: {
        atRiskHousingSituation,
        otherAtRiskHousing,
      },
    },
    homelessnessContact: {
      ...homelessnessContact,
      properties: {
        ...homelessnessContact.properties,
        // we want veterans to be able to type in anything they want, we'll
        // sanitize their input to adhere to the pattern in vets-json-schema in
        // the submit transformer
        name: _.omit('pattern', homelessnessContact.properties.name),
      },
    },
  },
};
