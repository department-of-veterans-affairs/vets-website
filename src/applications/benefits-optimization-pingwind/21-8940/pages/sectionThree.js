import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaDateField from 'platform/forms-system/src/js/web-component-fields/VaDateField';
import { wrapDateUiWithDl } from '../helpers/reviewHelpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Employment Timeline',
    'ui:description': ' When did your disability affect your work? ',

    disabilityDate: wrapDateUiWithDl({
      ...currentOrPastDateUI({
        title: 'Date your disability affected full-time employment',
        hint: 'For example: January 19 2022',
      }),
      'ui:webComponentField': VaDateField,
    }),

    lastWorkedDate: wrapDateUiWithDl({
      ...currentOrPastDateUI({
        title: 'Date you last worked full-time',
        hint: 'For example: January 19 2022',
      }),
      'ui:webComponentField': VaDateField,
    }),
    disabledWorkDate: wrapDateUiWithDl({
      ...currentOrPastDateUI({
        title: 'Date you became too disabled to work',
        hint: 'For example: January 19 2022',
      }),
      'ui:webComponentField': VaDateField,
    }),
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
