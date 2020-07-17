import get from 'platform/utilities/data/get';
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
  'view:needsCarHelp': {
    'ui:options': {
      expandUnder: 'view:modifyingCar',
    },
    'view:alreadyClaimedVehicleAllowance': {
      'ui:title': 'Have you ever been granted an automobile allowance?',
      'ui:widget': 'yesNo',
    },
    'view:doubleAllowanceAlert': {
      'ui:description': doubleAllowanceAlert,
      'ui:options': {
        hideIf: formData =>
          !get(
            'view:needsCarHelp.view:alreadyClaimedVehicleAllowance',
            formData,
            false,
          ),
      },
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
    'view:needsCarHelp': {
      type: 'object',
      properties: {
        'view:alreadyClaimedVehicleAllowance': {
          type: 'boolean',
        },
        'view:doubleAllowanceAlert': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
