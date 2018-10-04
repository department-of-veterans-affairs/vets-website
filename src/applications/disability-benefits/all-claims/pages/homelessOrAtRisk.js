import _ from '../../../../platform/utilities/data';
import fullSchema from '../config/schema';
import merge from 'lodash/fp/merge';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';

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
      'Please provide the name and number of a person we can call if we need to get in touch with you.',
    'ui:options': {
      expandUnder: 'homelessOrAtRisk',
      expandUnderCondition: housing =>
        housing === HOMELESSNESS_TYPES.homeless ||
        housing === HOMELESSNESS_TYPES.atRisk,
    },
    name: {
      'ui:title': 'Name of person we can contact',
      'ui:required': formData =>
        !!_.get('homelessnessContact.phoneNumber', formData, null),
    },
    phoneNumber: merge(phoneUI('Phone number'), {
      'ui:required': formData =>
        !!_.get('homelessnessContact.name', formData, null),
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
    homelessnessContact,
  },
};
