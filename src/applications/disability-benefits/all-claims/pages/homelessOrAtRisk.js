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
  homelessnessContact
} = fullSchema.properties;

import {
  homelessLabel,
  atRiskLabel
} from '../content/homelessOrAtRisk';

import {
  OTHER,
  AT_RISK,
  HOMELESS
} from '../constants';

export const uiSchema = {
  homelessOrAtRisk: {
    'ui:title': 'Are you homeless or at risk of becoming homeless?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        no: 'No',
        homeless: homelessLabel,
        atRisk: atRiskLabel
      }
    }
  },
  'view:isHomeless': {
    'ui:options': {
      expandUnder: 'homelessOrAtRisk',
      expandUnderCondition: HOMELESS
    },
    homelessHousingSituation: {
      'ui:title': 'Please describe your current living situation.',
      'ui:required': (formData) => _.get('homelessOrAtRisk', formData, '') === HOMELESS,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          shelter: 'I’m living in a homeless shelter.',
          notShelter: 'I’m living somewhere other than a shelter. (For example, I’m living in a car or a tent.)',
          anotherPerson: 'I’m living with another person.',
          other: 'Other'
        }
      }
    },
    otherHomelessHousing: {
      'ui:title': 'Please describe',
      'ui:required': (formData) => _.get('view:isHomeless.homelessHousingSituation', formData, '') === OTHER,
      'ui:options': {
        hideIf: (formData) => _.get('view:isHomeless.homelessHousingSituation', formData, '') !== OTHER,
      }
    },
    needToLeaveHousing: {
      'ui:title': 'Do you need to quickly leave your current living situation?',
      'ui:required': (formData) => _.get('homelessOrAtRisk', formData, '') === HOMELESS,
      'ui:widget': 'yesNo'
    }
  },
  'view:isAtRisk': {
    'ui:options': {
      expandUnder: 'homelessOrAtRisk',
      expandUnderCondition: AT_RISK
    },
    atRiskHousingSituation: {
      'ui:title': 'Please describe your housing situation',
      'ui:required': (formData) => _.get('homelessOrAtRisk', formData, '') === AT_RISK,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          losingHousing: 'I’m losing my housing in 30 days.',
          leavingShelter: 'I’m leaving a publicly funded homeless shelter soon.',
          other: 'Other'
        }
      }
    },
    otherAtRiskHousing: {
      'ui:title': 'Please describe',
      'ui:required': (formData) => _.get('view:isAtRisk.atRiskHousingSituation', formData, '') === 'other',
      'ui:options': {
        hideIf: (formData) => _.get('view:isAtRisk.atRiskHousingSituation', formData, '') !== 'other'
      }
    }
  },
  homelessnessContact: {
    'ui:title': ' ',
    'ui:description': 'Please provide the name and number of a person we can call if we need to get in touch with you.',
    'ui:options': {
      expandUnder: 'homelessOrAtRisk',
      expandUnderCondition: (housing) => housing === HOMELESS || housing === AT_RISK
    },
    name: {
      'ui:title': 'Name of person we can contact',
      'ui:required': (formData) => !!_.get('homelessnessContact.phoneNumber', formData, null)
    },
    phoneNumber: merge(
      phoneUI('Phone number'),
      { 'ui:required': (formData) => !!_.get('homelessnessContact.name', formData, null) }
    )
  }
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
        needToLeaveHousing
      }
    },
    'view:isAtRisk': {
      type: 'object',
      properties: {
        atRiskHousingSituation,
        otherAtRiskHousing
      }
    },
    homelessnessContact
  }
};
