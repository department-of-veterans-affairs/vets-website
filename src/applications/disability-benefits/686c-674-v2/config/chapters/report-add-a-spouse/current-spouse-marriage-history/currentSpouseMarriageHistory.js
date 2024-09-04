import { capitalize } from 'lodash';
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    spouseWasMarriedBefore: yesNoSchema,
  },
};

export const uiSchema = {
  ...titleUI('Spouse’s marital history'),
  spouseWasMarriedBefore: {
    ...yesNoUI({
      title: 'Has your spouse been married before?',
      required: () => true,
    }),
    'ui:options': {
      updateSchema: (formData, _schema, _uiSchema) => {
        const { first, last } = formData?.spouseInformation?.spouseLegalName;
        const nameTitleUI = _uiSchema;

        if (first && last) {
          nameTitleUI['ui:title'] = `Has ${capitalize(first)} ${capitalize(
            last,
          )} been married before?`;
        }

        return _schema;
      },
    },
  },
};
