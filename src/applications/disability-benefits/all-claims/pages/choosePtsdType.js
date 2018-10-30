import { validateBooleanGroup } from 'us-forms-system/lib/js/validation';

import {
  ptsdTypeDescription,
  ptsdTypeHelp,
  nonCombatPtsdType,
} from '../content/ptsdTypeInfo';

import { disabilityNameTitle } from '../content/newPTSDFollowUp';

export const uiSchema = {
  'ui:title': disabilityNameTitle,
  'ui:description': ptsdTypeDescription,
  'view:selectablePtsdTypes': {
    'ui:title':
      'What type of event contributed to your PTSD? (Choose all that apply.)',
    'ui:options': { showFieldLabel: true },
    'ui:validations': [
      {
        validator: validateBooleanGroup,
      },
    ],
    'ui:errorMessages': {
      atLeastOne: 'Please select at least one event type',
    },
    'view:combatPtsdType': {
      'ui:title': 'Combat',
    },
    'view:mstPtsdType': {
      'ui:title': 'Military Sexual Trauma',
    },
    'view:assaultPtsdType': {
      'ui:title': 'Personal Assault',
    },
    'view:noncombatPtsdType': {
      'ui:title': nonCombatPtsdType,
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
        'view:noncombatPtsdType': {
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
