import { preparerQualificationsQuestionTitle } from '../config/helpers';
import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';
import { preparerQualificationsOptions } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerQualifications: {
      'ui:widget': GroupCheckboxWidget,
      'ui:options': {
        updateSchema: formData => {
          return {
            title: preparerQualificationsQuestionTitle({ formData }),
          };
        },
        forceDivWrapper: true,
        // TODO: build out detailed info for each option
        labels: Object.values(preparerQualificationsOptions),
        showFieldLabel: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      preparerQualifications: {
        type: 'string',
      },
    },
    required: ['preparerQualifications'],
  },
};
