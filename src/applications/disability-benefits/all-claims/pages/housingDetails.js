import _ from '../../../../platform/utilities/data';
import merge from 'lodash/fp/merge';
import fullSchema from '../config/schema';
import phoneUI from 'us-forms-system/lib/js/definitions/phone';

const {
  homelessHousingSituation,
  otherHomelessHousing,
  needToLeaveHousing,
  atRiskHousingSituation,
  otherAtRiskHousing,
  homelessnessContact
} = fullSchema.properties;

export const uiSchema = {
  'ui:title': '',
  'view:isHomelessFollowUp': {
    'ui:options': {
      hideIf: (formData) => !_.get('isHomeless', formData, false)
    },
    homelessHousingSituation: {
      'ui:title': 'Please describe your current living situation',
      'ui:required': (formData) => _.get('isHomeless', formData, false),
      'ui:widget': 'radio'
    },
    otherHomelessHousing: {
      'ui:title': 'Please describe',
      'ui:required': (formData) => _.get('view:isHomelessFollowUp.homelessHousingSituation', formData, '') === 'Other',
      'ui:options': {
        expandUnder: 'homelessHousingSituation',
        expandUnderCondition: (housingType) => housingType === 'Other'
      }
    },
    needToLeaveHousing: {
      'ui:title': 'Do you need to quickly leave your current living situation?',
      'ui:required': (formData) => _.get('isHomeless', formData, false),
      'ui:widget': 'yesNo'
    }
  },
  'view:atRiskFollowUp': {
    atRiskHousingSituation: {
      'ui:title': 'Please describe your current living situation.',
      'ui:required': (formData) => _.get('isAtRisk', formData, false),
      'ui:widget': 'radio',
      'ui:options': {
        hideIf: (formData) => _.get('isHomeless', formData, false)
      }
    },
    otherAtRiskHousing: {
      'ui:title': 'Plese describe',
      'ui:required': (formData) => _.get('view:atRiskFollowUp.atRiskHousingSituation', formData, '') === 'Other',
      'ui:options': {
        expandUnder: 'atRiskHousingSituation',
        expandUnderCondition: (housingType) => housingType === 'Other'
      }
    }
  },
  homelessnessContact: {
    'ui:title': ' ',
    'ui:description': 'Please provide the name and number of a person we should call if we need to get in touch with you.',
    name: {
      'ui:title': 'Name of person we should contact ',
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
  properties: {
    'view:isHomelessFollowUp': {
      type: 'object',
      properties: {
        homelessHousingSituation,
        otherHomelessHousing,
        needToLeaveHousing
      }
    },
    'view:atRiskFollowUp': {
      type: 'object',
      properties: {
        atRiskHousingSituation,
        otherAtRiskHousing
      }
    },
    homelessnessContact
  }
};
