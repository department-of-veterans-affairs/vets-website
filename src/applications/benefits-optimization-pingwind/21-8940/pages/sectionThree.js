import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { wrapDateUiWithDl } from '../helpers/reviewHelpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Employment Timeline',
    'ui:description': ' When did your disability affect your work? ',

    disabilityDate: wrapDateUiWithDl(
      currentOrPastDateUI('Date your disability affected full-time employment'),
    ),

    lastWorkedDate: wrapDateUiWithDl(
      currentOrPastDateUI('Date you last worked full-time'),
    ),
    disabledWorkDate: wrapDateUiWithDl(
      currentOrPastDateUI('Date you became too disabled to work'),
    ),
  },
  schema: {
    type: 'object',
    properties: {
      disabilityDate: currentOrPastDateSchema,
      lastWorkedDate: currentOrPastDateSchema,
      disabledWorkDate: currentOrPastDateSchema,
    },
    required: ['disabilityDate', 'lastWorkedDate', 'disabledWorkDate'],
  },
};
