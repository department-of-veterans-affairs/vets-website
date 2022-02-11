import {
  ptsdNonCombatTitle,
  ptsdBypassRadioLabel,
  ptsdBypassAdditionalInfo,
} from '../content/ptsdBypassContent';
import { showPtsdNonCombat } from '../utils';

export const uiSchema = {
  'ui:title': ' ',
  'ui:description': ptsdNonCombatTitle,
  'ui:options': {
    forceDivWrapper: true,
  },
  skip781ForNonCombatReason: {
    'ui:title': ptsdBypassRadioLabel,
    'ui:required': formData =>
      // shouldn't show if combat question already true
      showPtsdNonCombat(formData) && !formData['view:skipToSupportingEvidence'],
    'ui:widget': 'yesNo',
  },
  'view:ptsdNonCombatBypassAdditionalInfo': {
    'ui:title': ' ',
    'ui:description': ptsdBypassAdditionalInfo,
  },
};

export const schema = {
  type: 'object',
  properties: {
    skip781ForNonCombatReason: {
      type: 'boolean',
    },
    'view:ptsdNonCombatBypassAdditionalInfo': {
      type: 'object',
      properties: {},
    },
  },
};
