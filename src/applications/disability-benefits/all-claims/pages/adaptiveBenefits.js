import {
  benefitDescription,
  doubleAllowanceAlert,
} from '../content/adaptiveBenefits';

export const uiSchema = {
  'ui:title': 'Automobile allowance and adaptive benefits',
  'ui:description': benefitDescription,
  'view:modifyingHome': {
    'ui:title': 'Do you need help buying or modifying your home?',
    'ui:widget': 'yesNo',
  },
  'view:modifyingCar': {
    'ui:title': 'Do you need help buying or modifying your car?',
    'ui:widget': 'yesNo',
  },
  'view:alreadyClaimedVehicleAllowance': {
    'ui:title': 'Have you ever applied for an automobile allowance?',
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'view:modifyingCar',
    },
  },
  'view:doubleAllowanceAlert': {
    'ui:description': doubleAllowanceAlert,
    'ui:options': {
      expandUnder: 'view:modifyingCar',
      hideIf: formData => !formData['view:alreadyClaimedVehicleAllowance'],
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:modifyingHome': {
      type: 'boolean',
    },
    'view:modifyingCar': {
      type: 'boolean',
    },
    'view:alreadyClaimedVehicleAllowance': {
      type: 'boolean',
    },
    'view:doubleAllowanceAlert': {
      type: 'object',
      properties: {},
    },
  },
};
