import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
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
  skip781ForNonCombatReason: yesNoUI({
    title: ptsdBypassRadioLabel,
    required: formData =>
      // shouldn't show if combat question already true
      showPtsdNonCombat(formData) && !formData['view:skipToSupportingEvidence'],
  }),
  'view:ptsdNonCombatBypassAdditionalInfo': {
    'ui:title': ' ',
    'ui:description': ptsdBypassAdditionalInfo,
  },
};

export const schema = {
  type: 'object',
  properties: {
    skip781ForNonCombatReason: yesNoSchema,
    'view:ptsdNonCombatBypassAdditionalInfo': {
      type: 'object',
      properties: {},
    },
  },
};
