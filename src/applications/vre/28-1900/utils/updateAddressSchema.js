import get from 'platform/utilities/data/get';
import {
  COUNTRY_NAMES,
  STATE_NAMES,
  STATE_VALUES,
} from 'platform/forms-system/src/js/definitions/profileAddress';

export default function updateAddressUiSchema(uiSchema) {
  return {
    ...uiSchema,
    country: {
      ...uiSchema.country,
      'ui:options': {
        ...uiSchema.country['ui:options'],
        updateSchema: (formData, schema, existingSchema, index) => {
          const originalResult = uiSchema.country['ui:options'].updateSchema(
            formData,
            schema,
            existingSchema,
            index,
          );

          return {
            ...originalResult,
            type: 'string',
            enum: COUNTRY_NAMES,
            enumNames: COUNTRY_NAMES,
          };
        },
      },
      state: {
        ...uiSchema.state,
        'ui:options': {
          ...uiSchema.state['ui:options'],
          replaceSchema: (formData, _schema, _, index) => {
            const insertArrayIndex = (key, idx) =>
              key.replace('[INDEX]', `[${idx}]`);
            const getPath = (pathToData, idx) =>
              typeof idx === 'number'
                ? insertArrayIndex(pathToData, idx)
                : pathToData;

            const formDataPath = getPath('veteranAddress', index);
            const data = get(formDataPath, formData) ?? {};
            const { country } = data;
            if (country === 'United States') {
              return {
                type: 'string',
                title: 'State',
                enum: STATE_VALUES,
                enumNames: STATE_NAMES,
              };
            }
            return {
              type: 'string',
              title: 'State/Province/Region',
            };
          },
        },
      },
    },
  };
}
