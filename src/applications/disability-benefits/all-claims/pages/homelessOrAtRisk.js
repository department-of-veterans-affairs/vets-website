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
      expandUnderCondition: (housing) => housing === 'homeless'
    },
    homelessHousingSituation: {
      'ui:title': 'Please describe your current living situation.',
      'ui:required': (formData) => _.get('homelessOrAtRisk', formData, '') === 'homeless',
      'ui:widget': 'radio'
    },
    otherHomelessHousing: {
      'ui:title': 'Please describe',
      'ui:required': (formData) => _.get('view:isHomeless.homelessHousingSituation', formData, '') === 'Other',
      'ui:options': {
        hideIf: (formData) => _.get('view:isHomeless.homelessHousingSituation', formData, '') !== 'Other',
      }
    },
    needToLeaveHousing: {
      'ui:title': 'Do you need to quickly leave your current living situation?',
      'ui:required': (formData) => _.get('homelessOrAtRisk', formData, '') === 'homeless',
      'ui:widget': 'radio'
    }
  },
  'view:isAtRisk': {
    'ui:options': {
      expandUnder: 'homelessOrAtRisk',
      expandUnderCondition: (housing) => housing === 'atRisk'
    },
    atRiskHousingSituation: {
      'ui:title': 'Please describe your housing situation',
      'ui:required': (formData) => _.get('homelessOrAtRisk', formData, '') === 'atRisk',
      'ui:widget': 'radio'
    },
    otherAtRiskHousing: {
      'ui:title': 'Please describe',
      'ui:required': (formData) => _.get('view:isAtRisk.atRiskHousingSituation', formData, '') === 'Other',
      'ui:options': {
        hideIf: (formData) => _.get('view:isAtRisk.atRiskHousingSituation', formData, '') !== 'Other'
      }
    }
  },
  homelessnessContact: {
    'ui:title': ' ',
    'ui:description': 'Please provide the name and number of a person we should call if we need to get in touch with you.',
    'ui:options': {
      expandUnder: 'homelessOrAtRisk',
      expandUnderCondition: (housing) => housing === 'homeless' || housing === 'atRisk'
    },
    name: {
      'ui:title': 'Name of person we should contact',
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
