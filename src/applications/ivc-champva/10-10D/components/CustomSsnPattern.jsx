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
      updateSchema: (_formData, _schema, _uiSchema, _index, _path) => {
        const required = ['ssn'];
        return {
          ..._schema,
          required,
        };
      },
    },
  };
};
