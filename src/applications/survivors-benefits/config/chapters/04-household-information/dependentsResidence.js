import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isYes } from '../../../utils/helpers';
import { AdditionalDependentsAlert } from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Dependent’s residence'),
    childrenLiveTogetherButNotWithSpouse: yesNoUI({
      title:
        'Do the children who don’t live with you reside at the same address?',
    }),
    residenceAlert: {
      'ui:description': AdditionalDependentsAlert,
      'ui:options': {
        hideIf: formData =>
          isYes(formData?.childrenLiveTogetherButNotWithSpouse),
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['childrenLiveTogetherButNotWithSpouse'],
    properties: {
      childrenLiveTogetherButNotWithSpouse: yesNoSchema,
      residenceAlert: {
        type: 'object',
        properties: {},
      },
    },
  },
};
