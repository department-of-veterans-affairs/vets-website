import _ from 'lodash/fp';

import AutosuggestField from '../fields/AutosuggestField';

// don't use for enum fields, they need access to the
// list of enums and names
export const schema = {
  type: 'string'
};

export function uiSchema(label, getOptions, options = {}) {
  return _.merge({
    'ui:title': label,
    'ui:field': AutosuggestField,
    'ui:validations': [
      (errors, formData) => {
        if (formData && formData.startsWith('field:autosuggest||')) {
          const fields = formData.split('||');

          if (!fields[1] && fields[2]) {
            errors.addError('Please select an option from the suggestions');
          }
        }
      }
    ],
    'ui:options': {
      showFieldLabel: 'label',
      maxOptions: 20,
      getOptions
    }
  }, options);
}
