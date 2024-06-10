import { validateSSN } from 'platform/forms-system/src/js/validation';
import SSNReviewWidget from 'platform/forms-system/src/js/review/SSNWidget';
import get from 'platform/utilities/data/get';
import { vaFileNumberUI } from 'platform/forms-system/src/js/web-component-patterns';
import HandlePrefilledSSN from './maskSSN';

const SSN_DEFAULT_TITLE = 'Social Security number';

const customSSNUI = title => {
  return {
    'ui:title': title ?? SSN_DEFAULT_TITLE,
    'ui:webComponentField': HandlePrefilledSSN(),
    'ui:reviewWidget': SSNReviewWidget,
    'ui:validations': [validateSSN],
    'ui:errorMessages': {
      pattern:
        'Please enter a valid 9 digit Social Security number (dashes allowed)',
      required: 'Please enter a Social Security number',
    },
  };
};

// Using different hint text from the standard ssnOrVaFileNumberUI
export const ssnOrVaFileNumberCustomUI = () => {
  return {
    ssn: customSSNUI(),
    vaFileNumber: {
      ...vaFileNumberUI(),
      'ui:options': {
        hint:
          'Enter this number only if it’s different than the Social Security number',
      },
    },
    'ui:options': {
      updateSchema: (formData, _schema, _uiSchema, index, path) => {
        const { ssn, vaFileNumber } = get(path, formData) ?? {};

        let required = ['ssn'];
        if (!ssn && vaFileNumber) {
          required = ['vaFileNumber'];
        }

        return {
          ..._schema,
          required,
        };
      },
    },
  };
};
