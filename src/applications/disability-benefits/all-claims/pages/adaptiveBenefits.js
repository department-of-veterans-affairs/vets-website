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
    'ui:title': 'Have you applied for an automobile allowance before?',
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'view:modifyingCar',
    },
  },
  'view:doubleAllowanceAlert': {
    'ui:description': doubleAllowanceAlert,
  },
};

export const schema = {
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
};
