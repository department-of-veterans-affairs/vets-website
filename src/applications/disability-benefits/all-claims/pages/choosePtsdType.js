import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';

import { ptsdTypeHelp, ptsdTypeEnum } from '../content/ptsdTypeInfo';

import { disabilityNameTitle } from '../content/newPTSDFollowUp';

export const uiSchema = {
  'ui:title': disabilityNameTitle,
  'view:selectablePtsdTypes': {
    'ui:title':
      'What type of event contributed to your PTSD? (Choose all that apply.)',
    'ui:webComponentField': VaCheckboxGroupField,
    'ui:options': { showFieldLabel: true },
    'ui:validations': [
      {
        validator: validateBooleanGroup,
        options: { wrappedValidator: validateBooleanGroup },
      },
    ],
    'ui:errorMessages': {
      atLeastOne: 'Please select at least one event type',
    },
    'ui:required': () => true,
    'view:combatPtsdType': {
      'ui:title': ptsdTypeEnum.combatPtsdType,
    },
    'view:mstPtsdType': {
      'ui:title': ptsdTypeEnum.mstPtsdType,
    },
    'view:assaultPtsdType': {
      'ui:title': ptsdTypeEnum.assaultPtsdType,
    },
    'view:nonCombatPtsdType': {
      'ui:title': ptsdTypeEnum.nonCombatPtsdType,
    },
  },
  'view:ptsdTypeHelp': {
    'ui:description': ptsdTypeHelp,
  },
};

export const schema = {
  type: 'object',
  required: ['view:selectablePtsdTypes'],
  properties: {
    'view:selectablePtsdTypes': {
      type: 'object',
      properties: {
        'view:combatPtsdType': {
          type: 'boolean',
        },
        'view:mstPtsdType': {
          type: 'boolean',
        },
        'view:assaultPtsdType': {
          type: 'boolean',
        },
        'view:nonCombatPtsdType': {
          type: 'boolean',
        },
      },
    },
    'view:ptsdTypeHelp': {
      type: 'object',
      properties: {},
    },
  },
};
