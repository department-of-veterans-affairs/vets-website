import _ from 'platform/utilities/data';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import merge from 'lodash/merge';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

const {
  homelessOrAtRisk,
  homelessHousingSituation,
  otherHomelessHousing,
  needToLeaveHousing,
  atRiskHousingSituation,
  otherAtRiskHousing,
  homelessnessContact,
} = fullSchema.properties;

import {
  HOMELESSNESS_TYPES,
  HOMELESSNESS_LABELS,
  AT_RISK_HOUSING_TYPES,
  HOMELESS_HOUSING_TYPES,
  AT_RISK_HOUSING_LABELS,
  HOMELESS_HOUSING_LABELS,
} from '../constants';

import { getHomelessOrAtRisk } from '../utils';
import ConfirmationHousingSituation from '../components/confirmationFields/ConfirmationHousingSituation';

export const uiSchema = {
  homelessOrAtRisk: {
    'ui:title': 'Are you homeless or at risk of becoming homeless?',
    'ui:webComponentField': VaRadioField,
    'ui:widget': 'radio',
    'ui:options': {
      labels: HOMELESSNESS_LABELS,
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
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: HOMELESS_HOUSING_LABELS,
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
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: AT_RISK_HOUSING_LABELS,
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
      'Let us know where we can contact you if you also lose access to your phone number.',
    'ui:options': {
      expandUnder: 'homelessOrAtRisk',
      expandUnderCondition: housing =>
        housing === HOMELESSNESS_TYPES.homeless ||
        housing === HOMELESSNESS_TYPES.atRisk,
    },
    name: {
      'ui:title': 'Name of alternate contact or place',
      'ui:required': getHomelessOrAtRisk,
    },
    phoneNumber: merge(
      {},
      phoneUI('Phone number of alternate contact or place'),
      {
        'ui:required': getHomelessOrAtRisk,
      },
    ),
  },
  'ui:confirmationField': ConfirmationHousingSituation,
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
