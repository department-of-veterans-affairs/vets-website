import get from 'platform/utilities/data/get';
import {
  vaFileNumberUI,
  ssnUI,
} from 'platform/forms-system/src/js/web-component-patterns';

// Using different hint text from the standard ssnOrVaFileNumberUI
export const ssnOrVaFileNumberCustomUI = () => {
  return {
    ssn: ssnUI(),
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
