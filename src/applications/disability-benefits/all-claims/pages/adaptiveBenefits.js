import get from 'platform/utilities/data/get';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns/yesNoPattern';
import {
  benefitDescription,
  doubleAllowanceAlert,
} from '../content/adaptiveBenefits';

export const uiSchema = {
  'ui:title': 'Automobile allowance and adaptive benefits',
  'ui:description': benefitDescription,
  'view:modifyingHome': yesNoUI(
    'Do you need help buying or modifying your home?',
  ),
  'view:modifyingCar': yesNoUI(
    'Do you need help buying or modifying your car?',
  ),
  'view:needsCarHelp': {
    'ui:options': {
      expandUnder: 'view:modifyingCar',
    },
    'view:alreadyClaimedVehicleAllowance': yesNoUI(
      'Have you ever been granted an automobile allowance?',
    ),
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
