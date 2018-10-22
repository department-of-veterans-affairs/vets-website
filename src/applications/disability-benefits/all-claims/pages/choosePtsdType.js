import { ptsdTypeDescription, ptsdTypeHelp } from '../content/ptsdTypeInfo';

import { disabilityNameTitle } from '../content/newPTSDFollowUp';

export const uiSchema = {
  'ui:title': disabilityNameTitle,
  'ui:description': ptsdTypeDescription,
  'view:selectablePtsdTypes': {
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
      'ui:title':
        'Non-Combat PTSD other than Military Sexual Trauma or Personal Assault',
    },
  },
  'view:ptsdTypeHelp': {
    'ui:description': ptsdTypeHelp,
  },
};

export const schema = {
  type: 'object',
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
