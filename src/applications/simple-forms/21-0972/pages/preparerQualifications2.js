import { preparerSigningReasonOptions } from '../definitions/constants';
import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';
import { preparerSigningReasonQuestionTitle } from '../config/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerSigningReason: {
      'ui:widget': GroupCheckboxWidget,
      'ui:options': {
        updateSchema: formData => {
          return {
            title: preparerSigningReasonQuestionTitle(formData),
          };
        },
        forceDivWrapper: true,
        labels: Object.values(preparerSigningReasonOptions),
        showFieldLabel: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      preparerSigningReason: {
        type: 'string',
      },
    },
    required: ['preparerSigningReason'],
  },
};
