import {
  ptsdCombatTitle,
  ptsdBypassRadioLabel,
  ptsdBypassAdditionalInfo,
} from '../content/ptsdBypassContent';
import { showPtsdCombat } from '../utils';

export const uiSchema = {
  'ui:title': ' ',
  'ui:description': ptsdCombatTitle,
  'ui:options': {
    forceDivWrapper: true,
  },
  skip781ForCombatReason: {
    'ui:title': ptsdBypassRadioLabel,
    'ui:required': showPtsdCombat,
    'ui:widget': 'yesNo',
  },
  'view:ptsdCombatBypassAdditionalInfo': {
    'ui:title': ' ',
    'ui:description': ptsdBypassAdditionalInfo,
  },
};

export const schema = {
  type: 'object',
  properties: {
    skip781ForCombatReason: {
      type: 'boolean',
    },
    'view:ptsdCombatBypassAdditionalInfo': {
      type: 'object',
      properties: {},
    },
  },
};
