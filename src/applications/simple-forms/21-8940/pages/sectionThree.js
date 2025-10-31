import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Employment Timeline',
    'ui:description': ' When did your disability affect your work? ',

    disabilityDate: currentOrPastDateUI(
      'Date your disability affected full-time employment',
    ),

    lastWorkedDate: currentOrPastDateUI('Date you last worked full-time'),
    disabledWorkDate: currentOrPastDateUI(
      'Date you became too disabled to work',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      disabilityDate: currentOrPastDateSchema,
      lastWorkedDate: currentOrPastDateSchema,
      disabledWorkDate: currentOrPastDateSchema,
    },
    required: [
      'disabilityDate',
      'lastWorkedDate',
      'disabledWorkDate',
    ],
  },
};
