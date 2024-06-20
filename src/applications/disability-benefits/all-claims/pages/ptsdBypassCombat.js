import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
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
  skip781ForCombatReason: yesNoUI({
    title: ptsdBypassRadioLabel,
    required: showPtsdCombat,
  }),
  'view:ptsdCombatBypassAdditionalInfo': {
    'ui:title': ' ',
    'ui:description': ptsdBypassAdditionalInfo,
  },
};

export const schema = {
  type: 'object',
  properties: {
    skip781ForCombatReason: yesNoSchema,
    'view:ptsdCombatBypassAdditionalInfo': {
      type: 'object',
      properties: {},
    },
  },
};
